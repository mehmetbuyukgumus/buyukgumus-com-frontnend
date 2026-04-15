import Link from "next/link";
import styles from "./blog-list.module.css";

export default async function BlogList() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  
  const res = await fetch(`${apiUrl}/articles/`, { next: { revalidate: 0 } });
  const data = await res.json();
  
  const articles = data
    .filter((a) => a.is_published)
    .sort((a, b) => b.id - a.id);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.label}>ARCHIVE</span>
        <h1 className={styles.title}>All Technical Articles</h1>
      </header>

      <div className={styles.list}>
        {articles.length > 0 ? (
          articles.map((article) => (
            <Link
              key={article.id}
              href={`/blog/${article.slug}`}
              className={styles.card}
            >
              <div className={styles.cardHeader}>
                <span className={styles.date}>
                  {new Date(article.created_at).toLocaleDateString()}
                </span>
                {article.is_pinned && (
                  <span className={styles.pinned}>PINNED</span>
                )}
              </div>
              <h2 className={styles.cardTitle}>{article.title}</h2>
              <p className={styles.excerpt}>
                {article.excerpt || `${article.content.substring(0, 160)}...`}
              </p>
              <div className={styles.readMore}>
                Read full entry
                <span className="material-symbols-outlined">arrow_forward</span>
              </div>
            </Link>
          ))
        ) : (
          <p>No articles found in the archive.</p>
        )}
      </div>
    </div>
  );
}
