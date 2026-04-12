"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import ProjectCard from "../components/ProjectCard/ProjectCard";

export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const [projects, setProjects] = useState([]);
  const [articles, setArticles] = useState([]);
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, artRes, cvRes] = await Promise.all([
          fetch(`${apiUrl}/projects/`),
          fetch(`${apiUrl}/articles/`),
          fetch(`${apiUrl}/cv/`),
        ]);
        const projData = await projRes.json();
        const artData = await artRes.json();
        const cvData = await cvRes.json();

        // Pinned projects + fetch registry for icons
        setProjects(projData.filter((p) => p.is_pinned));
        // SORT ARTICLES BY NEWEST FIRST BUT ONLY SHOW PINNED ONES
        setArticles(
          artData
            .filter((a) => a.is_published && a.is_pinned) // RESTORED PINNED FILTER
            .sort((a, b) => b.id - a.id),
        );
        setCv(cvData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h2 className={styles.title}>
          Architecting the future through{" "}
          <span className={styles.highlight}>
            clean code*
            <span className={styles.vibeText}>* it means vibe code.</span>
          </span>
        </h2>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Technical Profile</h3>
        <div className={styles.cvCard}>
          {loading ? (
            <p>Loading dossier...</p>
          ) : cv ? (
            <div className={styles.cvFlex}>
              <div className={styles.profileImgContainer}>
                <img
                  src="/assets/pp.png"
                  alt="Mehmet Buyukgumus"
                  className={styles.profileImg}
                />
              </div>
              <div className={styles.cvInfo}>
                <h4>{cv.title}</h4>
                <p className={styles.cvSummary}>{cv.summary}</p>
                <Link href="/cv" className={styles.cvLink}>
                  Open Full Dossier
                </Link>
              </div>
            </div>
          ) : (
            <p>Dossier unavailable.</p>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Pinned Projects</h3>
        <div className={styles.grid}>
          {loading ? (
            <p>Loading projects...</p>
          ) : projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                skillIcons={cv?.skill_icons || {}}
              />
            ))
          ) : (
            <p>No projects found.</p>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Recent Blog Posts</h3>
        <div className={styles.grid}>
          {loading ? (
            <p>Loading articles...</p>
          ) : articles.length > 0 ? (
            articles.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className={styles.articleCard}
              >
                <div>
                  <p className={styles.date}>
                    {new Date(article.created_at).toLocaleDateString()}
                  </p>
                  <h5 className={styles.articleTitle}>{article.title}</h5>
                  <p className={styles.articleExcerpt}>
                    {article.excerpt || `${article.content.substring(0, 120)}...`}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p>No articles found.</p>
          )}
        </div>
      </section>
    </div>
  );
}
