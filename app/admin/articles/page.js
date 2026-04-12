"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import AdminWrapper from "../../../components/Admin/AdminWrapper";
import styles from "../projects/projects.module.css";
import localStyles from "./articles.module.css";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaChevronLeft,
  FaSave,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

// Dynamic import for the editor to prevent SSR issues
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false },
);

// Define Custom Color Command outside to keep component clean
const colorTextCommand = {
  name: "colorText",
  keyCommand: "colorText",
  buttonProps: { "aria-label": "Insert Color" },
  icon: <div style={{ color: "#00e5ff", fontWeight: "bold" }}>A</div>,
  execute: (state, api) => {
    const color = prompt("Enter color (hex or name, e.g. #ff4444):", "#00e5ff");
    if (!color) return;
    const newText = `<span style="color: ${color}">${state.selectedText || "Text to color"}</span>`;
    api.replaceSelection(newText);
  },
};

export default function AdminArticles() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    is_published: false,
    is_pinned: false,
  });
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/articles/`);
      const data = await res.json();
      setArticles(data);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt || "",
      is_published: article.is_published,
      is_pinned: article.is_pinned || false,
    });
    setIsEditing(true);
  };

  const handleNew = () => {
    setEditingArticle(null);
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      is_published: false,
      is_pinned: false,
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingArticle(null);
    setStatus({ type: "", message: "" });
  };

  const handleDelete = async (id) => {
    if (
      !confirm("🚨 Alert: This dossier will be purged from existence. Proceed?")
    )
      return;
    const token = localStorage.getItem("token");
    await fetch(`${apiUrl}/articles/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchArticles();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "loading", message: "Syncing Manuscript..." });

    try {
      const token = localStorage.getItem("token");
      const url = editingArticle
        ? `${apiUrl}/articles/${editingArticle.id}`
        : `${apiUrl}/articles/`;

      const method = editingArticle ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus({
          type: "success",
          message: `${editingArticle ? "Update" : "Creation"} Successful!`,
        });
        setTimeout(() => {
          setIsEditing(false);
          setEditingArticle(null);
          fetchArticles();
        }, 800);
      } else {
        const errorData = await res.json();
        setStatus({
          type: "error",
          message: errorData.detail || "Sync Error.",
        });
      }
    } catch (err) {
      setStatus({ type: "error", message: "Network Failure." });
    }
  };

  return (
    <AdminWrapper>
      {!isEditing ? (
        // --- LIST VIEW ---
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div
            className={styles.header}
            style={{
              marginBottom: "3rem",
              borderBottom: "1px solid var(--outline-variant)",
              paddingBottom: "2rem",
            }}
          >
            <div>
              <h2 className={styles.title} style={{ marginBottom: "4px" }}>
                Archived Manuscripts
              </h2>
              <p style={{ opacity: 0.5, fontSize: "13px" }}>
                Managing global technical knowledge base.
              </p>
            </div>
            <button
              className={styles.addBtn}
              onClick={handleNew}
              style={{ background: "var(--primary)", padding: "12px 24px" }}
            >
              <FaPlus /> New Manuscript
            </button>
          </div>

          <div style={{ display: "grid", gap: "1rem" }}>
            {loading ? (
              <p>Decrypting records...</p>
            ) : articles.length === 0 ? (
              <p>No records found in this sector.</p>
            ) : (
              articles.map((article) => (
                <div key={article.id} className={localStyles.manuscriptItem}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                    }}
                  >
                    <div
                      style={{
                        padding: "10px",
                        borderRadius: "10px",
                        background: article.is_published
                          ? "rgba(0, 255, 100, 0.1)"
                          : "rgba(255, 255, 255, 0.05)",
                        color: article.is_published ? "#00c853" : "#9e9e9e",
                      }}
                    >
                      {article.is_published ? <FaEye /> : <FaEyeSlash />}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: "1.1rem" }}>
                        {article.title}
                      </h4>
                      <p
                        style={{
                          margin: 0,
                          opacity: 0.4,
                          fontSize: "12px",
                          marginTop: "4px",
                        }}
                      >
                        {new Date(article.created_at).toLocaleDateString()} •{" "}
                        {article.is_published ? "PUBLIC" : "DRAFT"}
                      </p>
                    </div>
                  </div>
                  <div
                    className={styles.actions}
                    style={{ display: "flex", gap: "10px" }}
                  >
                    <button
                      onClick={() => handleEdit(article)}
                      className={styles.editBtn}
                      style={{
                        background: "var(--surface-container-highest)",
                        border: "none",
                        padding: "10px",
                        borderRadius: "10px",
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className={styles.deleteBtn}
                      style={{
                        background: "rgba(255, 68, 68, 0.1)",
                        color: "#ff4444",
                        border: "none",
                        padding: "10px",
                        borderRadius: "10px",
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        // --- EDITOR VIEW (FULL FOCUS) ---
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <button
              onClick={handleCancel}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "none",
                border: "none",
                color: "var(--on-surface-variant)",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              <FaChevronLeft /> Back to Archive
            </button>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <div
                style={{
                  fontSize: "12px",
                  color: status.type === "success" ? "#00c853" : "inherit",
                }}
              >
                {status.message}
              </div>
              <button
                onClick={handleSubmit}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "var(--primary)",
                  color: "white",
                  border: "none",
                  padding: "10px 24px",
                  borderRadius: "30px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                <FaSave /> Commit Changes
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={localStyles.formCard}>
            <input
              className={localStyles.titleInput}
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Draft your title here..."
              required
            />
            <textarea 
              className={localStyles.excerptInput}
              value={formData.excerpt} 
              onChange={e => setFormData({...formData, excerpt: e.target.value})} 
              placeholder="Write a short, engaging summary for the card..."
              rows={3}
            />

            <div data-color-mode="dark" className={localStyles.editorContainer}>
              <MDEditor
                value={formData.content}
                onChange={(val) =>
                  setFormData({ ...formData, content: val || "" })
                }
                height={850}
                preview="edit"
                extraCommands={[colorTextCommand]} // Add our color tool here
                visibleDragbar={false}
                textareaProps={{
                  placeholder: "Your story starts here...",
                }}
                style={{ background: "transparent" }}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "3rem",
                background: "var(--surface-container-low)",
                padding: "20px",
                borderRadius: "15px",
                marginTop: "2rem",
              }}
            >
              <div
                className={`${styles.field} ${styles.checkbox}`}
                style={{ margin: 0 }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_published: e.target.checked,
                      })
                    }
                  />
                  Enable Public Access (Publish)
                </label>
              </div>
              <div
                className={`${styles.field} ${styles.checkbox}`}
                style={{ margin: 0 }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.is_pinned}
                    onChange={(e) =>
                      setFormData({ ...formData, is_pinned: e.target.checked })
                    }
                  />
                  Feature in Homepage Hero
                </label>
              </div>
            </div>
          </form>
        </div>
      )}
    </AdminWrapper>
  );
}
