'use client'
import { useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import styles from './login.module.css'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const success = await login(username, password)
    if (!success) {
      setError('Invalid username or password')
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.loginCard} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Admin Access</h1>
        <p className={styles.subtitle}>Enter your credentials to manage the dossier.</p>
        
        {error && <p className={styles.error}>{error}</p>}
        
        <div className={styles.field}>
          <label>Username</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>
        
        <div className={styles.field}>
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        
        <button type="submit" className={styles.submitBtn}>
          Unlock Dashboard
        </button>
      </form>
    </div>
  )
}
