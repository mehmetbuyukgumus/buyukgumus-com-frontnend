'use client'
import { useState, useEffect } from 'react'
import AdminWrapper from '../../../components/Admin/AdminWrapper'
import styles from '../projects/projects.module.css'
import { FaTrash, FaPlus, FaLink, FaCode, FaBroom, FaSkull } from 'react-icons/fa'

export default function IconManager() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const [skillIcons, setSkillIcons] = useState({})
  const [newIcon, setNewIcon] = useState({ name: '', svg: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchIcons()
  }, [])

  const fetchIcons = async () => {
    try {
      const res = await fetch(`${apiUrl}/cv/`)
      const data = await res.json()
      setSkillIcons(data.skill_icons || {})
    } finally {
      setLoading(false)
    }
  }

  const normalize = (text) => text.toLowerCase().trim().replace(/\s+/g, '').replace(/\./g, '')

  const handleAdd = () => {
    if (!newIcon.name || !newIcon.svg) return
    const key = normalize(newIcon.name)
    setSkillIcons({ ...skillIcons, [key]: newIcon.svg.trim() })
    setNewIcon({ name: '', svg: '' })
  }

  const handleRemove = (key) => {
    const updated = { ...skillIcons }
    delete updated[key]
    setSkillIcons(updated)
  }

  // FORCE PURGE EVERYTHING FROM REGISTRY
  const hardReset = () => {
    if (!confirm('🚨 MASSIVE PURGE ALERT: This will clear THE ENTIRE icon database. You will have to re-add your custom icons. Are you 100% sure?')) return;
    setSkillIcons({}); // Clear state immediately
  }

  const handleSave = async () => {
    setSaving(true)
    const token = localStorage.getItem('token')
    try {
      await fetch(`${apiUrl}/cv/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ skill_icons: skillIcons })
      })
      alert('✅ Universal icon Library Cleared & Synced!')
    } finally {
      setSaving(false)
    }
  }

  const renderIconPreview = (val) => {
    if (val.startsWith('http')) {
      return <img src={val} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="icon" />
    }
    return <div style={{ width: '20px', height: '20px' }} dangerouslySetInnerHTML={{ __html: val }} />
  }

  return (
    <AdminWrapper>
      <div className={styles.header}>
        <h2 className={styles.title}>Universal Icon Library</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={hardReset} 
            style={{ 
              background: 'none', border: '1px solid #ff4444', color: '#ff4444', 
              padding: '8px 16px', borderRadius: '30px', fontSize: '13px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold'
            }}
          >
            <FaSkull /> HARD RESET (CLEAR ALL)
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '900px', display: 'grid', gap: '3rem', paddingBottom: '5rem' }}>
        <section style={{ background: 'var(--surface-container-low)', padding: '2rem', borderRadius: '20px', border: '1px solid var(--outline-variant)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Register New Artifact Icon</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '1rem', alignItems: 'flex-end' }}>
            <div className={styles.field} style={{ marginBottom: 0 }}>
              <label>Technology Name</label>
              <input value={newIcon.name} onChange={e => setNewIcon({...newIcon, name: e.target.value})} placeholder="e.g. Docker" style={{ height: '42px' }} />
            </div>
            <div className={styles.field} style={{ marginBottom: 0 }}>
              <label>Icon Source (URL or SVG Code)</label>
              <input value={newIcon.svg} onChange={e => setNewIcon({...newIcon, svg: e.target.value})} placeholder="https://... or <svg>..." style={{ height: '42px' }} />
            </div>
            <button onClick={handleAdd} className={styles.addBtn} style={{ height: '42px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
              <FaPlus style={{ marginRight: '8px' }} /> Add to Library
            </button>
          </div>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem' }}>
          {Object.entries(skillIcons).length > 0 ? (
            Object.entries(skillIcons).map(([name, val]) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--surface-container)', borderRadius: '15px', border: '1px solid var(--outline-variant)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{renderIconPreview(val)}</div>
                  <span style={{ fontWeight: 600, fontSize: '13px' }}>{name}</span>
                </div>
                <button onClick={() => handleRemove(name)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', opacity: 0.7 }}><FaTrash /></button>
              </div>
            ))
          ) : (
            <p style={{ opacity: 0.5, gridColumn: '1/-1', textAlign: 'center', padding: '2.5rem', border: '2px dashed var(--outline-variant)', borderRadius: '20px' }}>Library is empty. Start adding icons!</p>
          )}
        </section>

        <div style={{ padding: '2rem 0', borderTop: '1px solid var(--outline-variant)', marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={handleSave} className={styles.saveBtn} disabled={saving} style={{ padding: '12px 24px', fontSize: '14px', borderRadius: '30px', width: 'auto', minWidth: '200px', background: 'var(--primary)', color: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
            {saving ? 'Syncing...' : 'Commit Librarian Changes'}
          </button>
        </div>
      </div>
    </AdminWrapper>
  )
}
