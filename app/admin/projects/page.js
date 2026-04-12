'use client'
import { useState, useEffect } from 'react'
import AdminWrapper from '../../../components/Admin/AdminWrapper'
import styles from './projects.module.css'
import { FaCheck, FaBroom } from 'react-icons/fa'

export default function AdminProjects() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const [projects, setProjects] = useState([])
  const [skillIcons, setSkillIcons] = useState({})
  const [loading, setLoading] = useState(true)
  const [purging, setPurging] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tech_stack: '',
    github_url: '',
    live_url: '',
    is_pinned: false
  })
  const [status, setStatus] = useState({ type: '', message: '' })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [projRes, cvRes] = await Promise.all([
        fetch(`${apiUrl}/projects/`),
        fetch(`${apiUrl}/cv/`)
      ])
      const projData = await projRes.json()
      const cvData = await cvRes.json()
      setProjects(projData)
      setSkillIcons(cvData?.skill_icons || {})
    } finally {
      setLoading(false)
    }
  }

  // MASSIVE PURGE: CLEAR TECH STACKS FOR ALL PROJECTS
  const purgeAllTechStacks = async () => {
    if (!confirm('🚨 CRITICAL: This will remove the Tech Stack description from EVERY project artifact. This action cannot be undone. Proceed?')) return;
    
    setPurging(true)
    const token = localStorage.getItem('token')
    
    try {
      for (const project of projects) {
        await fetch(`${apiUrl}/projects/${project.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ ...project, tech_stack: '' })
        })
      }
      alert('✅ All project stacks purged successfully!')
      fetchData()
    } finally {
       setPurging(false)
    }
  }

  const toggleTech = (name) => {
    const currentList = formData.tech_stack.split(',').map(s => s.trim()).filter(s => s)
    let newListArr;
    if (currentList.includes(name)) {
      newListArr = currentList.filter(s => s !== name)
    } else {
      newListArr = [...currentList, name]
    }
    setFormData({ ...formData, tech_stack: newListArr.join(', ') })
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description || '',
      tech_stack: project.tech_stack || '',
      github_url: project.github_url || '',
      live_url: project.live_url || '',
      is_pinned: project.is_pinned || false
    })
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return
    const token = localStorage.getItem('token')
    await fetch(`${apiUrl}/projects/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    fetchData()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ type: 'loading', message: 'Saving...' })
    
    try {
      const token = localStorage.getItem('token')
      const url = editingProject 
        ? `${apiUrl}/projects/${editingProject.id}`
        : `${apiUrl}/projects/`
      
      const method = editingProject ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setStatus({ type: 'success', message: `Artifact ${editingProject ? 'updated' : 'created'} successfully!` })
        setEditingProject(null)
        setFormData({ title: '', description: '', tech_stack: '', github_url: '', live_url: '', is_pinned: false })
        fetchData()
      } else {
        const errorData = await res.json()
        setStatus({ type: 'error', message: errorData.detail || 'An error occurred' })
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Network error.' })
    }
    setTimeout(() => setStatus({ type: '', message: '' }), 3000)
  }

  return (
    <AdminWrapper>
      <div className={styles.header}>
        <h2 className={styles.title}>Project Dossier Administration</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={purgeAllTechStacks} 
            disabled={purging}
            style={{ 
              background: 'none', border: '1px solid #ff4444', color: '#ff4444', 
              padding: '8px 16px', borderRadius: '30px', fontSize: '12px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500'
            }}
          >
            <FaBroom /> {purging ? 'Purging...' : 'Purge All Tech Stacks'}
          </button>
          <button 
            className={styles.addBtn}
            onClick={() => {
              setEditingProject(null)
              setFormData({ title: '', description: '', tech_stack: '', github_url: '', live_url: '', is_pinned: false })
            }}
          >
            <span className="material-symbols-outlined">add</span>
            New Artifact
          </button>
        </div>
      </div>

      <div className={styles.gridContainer} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: '2rem' }}>
        <div className={styles.list}>
          {loading ? <p>Scanning records...</p> : projects.map(project => (
            <div key={project.id} className={styles.projectItem} style={{ marginBottom: '1rem', padding: '1.25rem', background: 'var(--surface-container-low)', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className={styles.info}>
                <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {project.title}
                  {project.is_pinned && <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--primary)' }}>push_pin</span>}
                </h4>
                <p style={{ opacity: 0.6, fontSize: '11px' }}>{project.tech_stack || '(Empty stack)'}</p>
              </div>
              <div className={styles.actions} style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => handleEdit(project)} className={styles.editBtn}>
                   <span className="material-symbols-outlined">edit</span>
                </button>
                <button onClick={() => handleDelete(project.id)} className={styles.deleteBtn}>
                   <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <form className={styles.form} onSubmit={handleSubmit} style={{ background: 'var(--surface-container)', padding: '2rem', borderRadius: '20px', position: 'sticky', top: '2rem', height: 'fit-content' }}>
          <h3>{editingProject ? 'Modify Artifact' : 'New Entry'}</h3>
          {status.message && <div className={`${styles.status} ${styles[status.type]}`} style={{ marginBottom: '1.5rem', padding: '12px', borderRadius: '10px' }}>{status.message}</div>}

          <div className={styles.field}><label>Title</label><input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required /></div>
          <div className={styles.field}><label>Description</label><textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} /></div>
          
          <div className={styles.field}>
            <label style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Artifact Tech Stack</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px', padding: '12px', background: 'var(--surface-container-low)', borderRadius: '15px', border: '1px solid var(--outline-variant)' }}>
              {Object.keys(skillIcons).length > 0 ? (
                Object.keys(skillIcons).map(name => {
                  const isSelected = formData.tech_stack.split(',').map(s => s.trim()).includes(name);
                  return (
                    <button key={name} type="button" onClick={() => toggleTech(name)} style={{ background: isSelected ? 'var(--primary)' : 'var(--surface-container-highest)', color: isSelected ? 'white' : 'var(--on-surface-variant)', border: 'none', padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      {isSelected && <FaCheck size={8} />} {name}
                    </button>
                  );
                })
              ) : (
                <p style={{ fontSize: '11px', opacity: 0.5 }}>Registry is empty.</p>
              )}
            </div>
          </div>

          <div className={styles.field}><label>GitHub</label><input value={formData.github_url} onChange={e => setFormData({...formData, github_url: e.target.value})} /></div>
          <div className={styles.field}><label>Live URL</label><input value={formData.live_url} onChange={e => setFormData({...formData, live_url: e.target.value})} /></div>
          
          <div className={styles.field} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              id="is_pinned"
              checked={formData.is_pinned} 
              onChange={e => setFormData({...formData, is_pinned: e.target.checked})}
              style={{ width: '20px', height: '20px' }}
            />
            <label htmlFor="is_pinned" style={{ marginBottom: 0, cursor: 'pointer', fontWeight: 'bold', color: 'var(--primary)' }}>
              Pin to Homepage
            </label>
          </div>

          <button type="submit" className={styles.saveBtn} style={{ width: '100%', padding: '1.2rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', marginTop: '1.5rem' }}>
            {editingProject ? 'Commit Changes' : 'Initialize Artifact'}
          </button>
        </form>
      </div>
    </AdminWrapper>
  )
}
