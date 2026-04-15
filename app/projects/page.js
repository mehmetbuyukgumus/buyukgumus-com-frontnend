import ProjectCard from '../../components/ProjectCard/ProjectCard'
import styles from './projects.module.css'

export default async function ProjectsPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  const [projRes, cvRes] = await Promise.all([
    fetch(`${apiUrl}/projects/`, { next: { revalidate: 0 } }),
    fetch(`${apiUrl}/cv/`, { next: { revalidate: 0 } })
  ])
  
  const projects = await projRes.json()
  const cv = await cvRes.json()

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.label}>GALLERY</span>
        <h1 className={styles.title}>All Technical Projects</h1>
      </header>

      <div className={styles.grid}>
        {projects.length > 0 ? (
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
