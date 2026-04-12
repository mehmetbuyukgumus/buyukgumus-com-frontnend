'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import styles from './project.module.css'

export default function ProjectDetail() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`${apiUrl}/projects/${id}`)
        if (res.ok) {
          const data = await res.json()
          setProject(data)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchProject()
  }, [id])

  if (loading) return <div className={styles.container}>Discovering artifacts...</div>
  if (!project) return <div className={styles.container}>Artifact not found.</div>

  const normalizeUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.meta}>
          <span className={styles.label}>TECHNICAL PROJECT / {project.id}</span>
          <h1 className={styles.title}>{project.title}</h1>
        </div>
        <div className={styles.links}>
          {project.live_url && (
            <a href={normalizeUrl(project.live_url)} target="_blank" className={styles.liveBtn}>
              <span className="material-symbols-outlined">rocket_launch</span>
              Access Live
            </a>
          )}
          {project.github_url && (
            <a href={normalizeUrl(project.github_url)} target="_blank" className={styles.githubBtn}>
              <span className="material-symbols-outlined">terminal</span>
              Repository
            </a>
          )}
        </div>
      </header>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Overview</h3>
        <p className={styles.description}>{project.description || 'No description provided.'}</p>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Technical Stack</h3>
        <div className={styles.techStack}>
          {project.tech_stack?.split(',').map(tech => (
            <span key={tech} className={styles.techTag}>{tech.trim()}</span>
          )) || <p>No technology specified.</p>}
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className="material-symbols-outlined">star</span>
            {project.stars || 0} Stars
          </div>
          <div className={styles.statItem}>
            <span className="material-symbols-outlined">fork_right</span>
            {project.forks || 0} Forks
          </div>
        </div>
      </footer>
    </div>
  )
}
