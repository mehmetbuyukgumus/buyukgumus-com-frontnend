"use client";
import { useState, useEffect } from "react";
import AdminWrapper from "../../../components/Admin/AdminWrapper";
import styles from "../projects/projects.module.css";
import { FaPlus, FaTrash, FaEdit, FaCheck, FaBroom } from "react-icons/fa";

export default function AdminCV() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    experience: [],
    education: [],
    extra_sections: [],
    skills: "",
    skill_icons: {},
  });
  const [loading, setLoading] = useState(true);
  const [purging, setPurging] = useState(false);

  useEffect(() => {
    fetchCV();
  }, []);

  const fetchCV = async () => {
    try {
      const res = await fetch(`${apiUrl}/cv/`);
      const data = await res.json();
      setFormData({
        title: data.title || "",
        summary: data.summary || "",
        experience: Array.isArray(data.experience) ? data.experience : [],
        education: Array.isArray(data.education) ? data.education : [],
        extra_sections: Array.isArray(data.extra_sections)
          ? data.extra_sections
          : [],
        skills: data.skills || "",
        skill_icons: data.skill_icons || {},
      });
    } finally {
      setLoading(false);
    }
  };

  // MASSIVE PURGE: CLEAR SKILLS LIST FOR CV PROFILE
  const purgeAllSkills = () => {
    if (
      !confirm(
        "🚨 CRITICAL CV PURGE: This will remove the ENTIRE skills list from your public dossier. Proceed?",
      )
    )
      return;
    setFormData({ ...formData, skills: "" });
  };

  const toggleSkill = (originalName) => {
    const currentSkills = formData.skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
    let newSkillsArr;
    if (currentSkills.includes(originalName)) {
      newSkillsArr = currentSkills.filter((s) => s !== originalName);
    } else {
      newSkillsArr = [...currentSkills, originalName];
    }
    setFormData({ ...formData, skills: newSkillsArr.join(", ") });
  };

  const handleAddItem = (type) => {
    const newItem = {
      id: Date.now(),
      company: "",
      title: "",
      period: "",
      description: "",
      isEditing: true,
    };
    setFormData({ ...formData, [type]: [...formData[type], newItem] });
  };

  const handleUpdateItem = (type, index, field, value) => {
    const list = [...formData[type]];
    list[index][field] = value;
    setFormData({ ...formData, [type]: list });
  };

  const handleRemoveItem = (type, index) => {
    const list = [...formData[type]];
    list.splice(index, 1);
    setFormData({ ...formData, [type]: list });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) return alert("No token found.");

    const cleanItem = ({ id, isEditing, ...rest }) => rest;
    const finalData = {
      ...formData,
      experience: formData.experience.map(cleanItem),
      education: formData.education.map(cleanItem),
      extra_sections: formData.extra_sections.map(
        ({ id, isEditing, items, ...rest }) => ({
          ...rest,
          items: items.map(cleanItem),
        }),
      ),
    };

    try {
      const res = await fetch(`${apiUrl}/cv/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(finalData),
      });
      if (res.ok) alert("✅ CV Dossier Synchronized!");
    } finally {
      setLoading(false);
    }
  };

  const renderItemCard = (item, onUpdate, onRemove, toggleEdit) => (
    <div
      style={{
        padding: "1rem",
        border: "1px solid var(--outline-variant)",
        borderRadius: "12px",
        background: "var(--surface-container-low)",
        marginBottom: "1rem",
      }}
    >
      {!item.isEditing ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <strong>{item.company}</strong>{" "}
            <span style={{ opacity: 0.6 }}>- {item.title}</span>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              onClick={toggleEdit}
              style={{
                color: "var(--primary)",
                background: "none",
                border: "none",
              }}
            >
              <FaEdit />
            </button>
            <button
              type="button"
              onClick={onRemove}
              style={{ color: "#ff4444", background: "none", border: "none" }}
            >
              <FaTrash />
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div className={styles.field}>
              <label>Entity</label>
              <input
                value={item.company}
                onChange={(e) => onUpdate("company", e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>Role</label>
              <input
                value={item.title}
                onChange={(e) => onUpdate("title", e.target.value)}
              />
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "1rem",
            }}
          >
            <div className={styles.field}>
              <label>Period</label>
              <input
                value={item.period}
                onChange={(e) => onUpdate("period", e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={toggleEdit}
              style={{
                marginTop: "1.8rem",
                background: "var(--primary)",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
              }}
            >
              DONE
            </button>
          </div>
          <div className={styles.field}>
            <label>Description</label>
            <textarea
              value={item.description}
              onChange={(e) => onUpdate("description", e.target.value)}
              rows={3}
            />
          </div>
        </div>
      )}
    </div>
  );

  if (loading) return <AdminWrapper>Scanning Dossier...</AdminWrapper>;

  return (
    <AdminWrapper>
      <div className={styles.header}>
        <h2 className={styles.title}>CV Dossier Administration</h2>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            type="button"
            onClick={purgeAllSkills}
            style={{
              background: "none",
              border: "1px solid #ff4444",
              color: "#ff4444",
              padding: "8px 16px",
              borderRadius: "30px",
              fontSize: "13px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: "bold",
            }}
          >
            <FaBroom /> Purge Artifact Skills
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "850px" }}>
        <form
          className={styles.form}
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "3rem" }}
        >
          <div className={styles.field}>
            <label>Dossier Title</label>
            <input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>
          <div className={styles.field}>
            <label>Executive Summary</label>
            <textarea
              value={formData.summary}
              onChange={(e) =>
                setFormData({ ...formData, summary: e.target.value })
              }
              rows={3}
            />
          </div>

          {/* SELECTOR ONLY FOR SKILLS */}
          <div className={styles.field}>
            <label style={{ color: "var(--primary)", fontWeight: "bold" }}>
              Master Artifact Skills
            </label>
            <p
              style={{ fontSize: "12px", opacity: 0.6, marginBottom: "1.5rem" }}
            >
              Synchronize your technical identity with the Master Icon Registry.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                background: "var(--surface-container-low)",
                padding: "20px",
                borderRadius: "15px",
                border: "1px solid var(--outline-variant)",
              }}
            >
              {Object.keys(formData.skill_icons).length > 0 ? (
                Object.keys(formData.skill_icons).map((name) => {
                  const isSelected = formData.skills
                    .split(",")
                    .map((s) => s.trim())
                    .includes(name);
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => toggleSkill(name)}
                      style={{
                        background: isSelected
                          ? "var(--primary)"
                          : "var(--surface-container-highest)",
                        color: isSelected
                          ? "white"
                          : "var(--on-surface-variant)",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "25px",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: isSelected ? "bold" : "normal",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {isSelected && <FaCheck size={10} />} {name}
                    </button>
                  );
                })
              ) : (
                <p style={{ fontSize: "12px", opacity: 0.5 }}>
                  Register icons in 'Universal Icons' section first.
                </p>
              )}
            </div>
            {formData.skills && (
              <p style={{ marginTop: "10px", fontSize: "11px", opacity: 0.5 }}>
                Current Selection:{" "}
                <span style={{ color: "var(--primary)" }}>
                  {formData.skills}
                </span>
              </p>
            )}
          </div>

          <section>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h3 style={{ margin: 0 }}>EXPERIENCE</h3>
              <button
                type="button"
                onClick={() => handleAddItem("experience")}
                className={styles.addBtn}
              >
                + New Role Entry
              </button>
            </div>
            {formData.experience.map((it, idx) =>
              renderItemCard(
                it,
                (f, v) => handleUpdateItem("experience", idx, f, v),
                () => handleRemoveItem("experience", idx),
                () => {
                  const l = [...formData.experience];
                  l[idx].isEditing = !l[idx].isEditing;
                  setFormData({ ...formData, experience: l });
                },
              ),
            )}
          </section>

          <section>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h3 style={{ margin: 0 }}>EDUCATION</h3>
              <button
                type="button"
                onClick={() => handleAddItem("education")}
                className={styles.addBtn}
              >
                + New Study Entry
              </button>
            </div>
            {formData.education.map((it, idx) =>
              renderItemCard(
                it,
                (f, v) => handleUpdateItem("education", idx, f, v),
                () => handleRemoveItem("education", idx),
                () => {
                  const l = [...formData.education];
                  l[idx].isEditing = !l[idx].isEditing;
                  setFormData({ ...formData, education: l });
                },
              ),
            )}
          </section>

          <button
            type="submit"
            className={styles.saveBtn}
            disabled={loading}
            style={{ fontSize: "1.2rem", padding: "1.5rem" }}
          >
            Commit Dossier Changes
          </button>
        </form>
      </div>
    </AdminWrapper>
  );
}
