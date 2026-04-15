import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize from "rehype-sanitize";
import "highlight.js/styles/github-dark.css";
import Link from "next/link";
import styles from "./blog.module.css";

export default async function BlogDetail({ params }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const { slug } = params;

  const [articleRes, allRes] = await Promise.all([
    fetch(`${apiUrl}/articles/${slug}`, { next: { revalidate: 0 } }),
    fetch(`${apiUrl}/articles/`, { next: { revalidate: 0 } }),
  ]);

  if (!articleRes.ok) {
    return <div className={styles.error}>Dossier entry not found.</div>;
  }

  const article = await articleRes.json();
  const allData = await allRes.json();

  const otherArticles = [...allData]
    .filter((a) => a.slug !== slug && a.is_published)
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

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

      <aside className={styles.rightSidebar}>
        <h3 className={styles.sidebarTitle}>OTHER ENTRIES</h3>
        <div className={styles.sidebarList}>
          {otherArticles.map((item) => (
            <Link
              key={item.id}
              href={`/blog/${item.slug}`}
              className={styles.sidebarItem}
            >
              <span className={styles.sidebarDate}>
                {new Date(item.created_at).toLocaleDateString()}
              </span>
              <h4 className={styles.sidebarItemTitle}>{item.title}</h4>
            </Link>
          ))}
        </div>
      </aside>
    </div>
  );
}
