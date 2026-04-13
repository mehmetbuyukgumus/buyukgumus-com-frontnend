"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize from "rehype-sanitize";
import "highlight.js/styles/github-dark.css";
import styles from "./blog.module.css";

export default function BlogDetail() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const articleRes = await fetch(`${apiUrl}/articles/${slug}`, { cache: 'no-store' });
        const articleData = await articleRes.json();
        setArticle(articleData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, apiUrl]);

  if (loading)
    return <div className={styles.loading}>Accessing archive...</div>;
  if (!article)
    return <div className={styles.error}>Dossier entry not found.</div>;

  return (
    <div className={styles.mainLayout}>
      <article className={styles.container}>
        <header className={styles.header}>
          <div className={styles.meta}>
            <span className={styles.label}>TECHNICAL ARTICLE</span>
            <p className={styles.date}>
              {new Date(article.created_at).toLocaleDateString()}
            </p>
          </div>
          <h1 className={styles.title}>{article.title}</h1>
        </header>

        <div className={styles.content}>
          <ReactMarkdown rehypePlugins={[rehypeHighlight, rehypeSanitize]}>
            {article.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
