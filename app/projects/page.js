'use client'
import { useState, useEffect } from 'react'
import ProjectCard from '../../components/ProjectCard/ProjectCard'
import styles from './projects.module.css'

export default function ProjectsPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const [projects, setProjects] = useState([])
  const [cv, setCv] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, cvRes] = await Promise.all([
          fetch(`${apiUrl}/projects/`),
          fetch(`${apiUrl}/cv/`)
        ])
        const projData = await projRes.json()
        const cvData = await cvRes.json()
        setProjects(projData)
        setCv(cvData)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.label}>GALLERY</span>
        <h1 className={styles.title}>All Technical Projects</h1>
      </header>

      <div className={styles.grid}>
        {loading ? (
          <p>Scanning sectors...</p>
        ) : projects.length > 0 ? (
          projects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              skillIcons={cv?.skill_icons || {}} 
            />
          ))
        ) : (
          <p>No project artifacts found.</p>
        )}
      </div>
    </div>
  )
}
