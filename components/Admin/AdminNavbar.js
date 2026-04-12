'use client'
import { useAuth } from '../../context/AuthContext'
import styles from './AdminNavbar.module.css'

export default function AdminNavbar() {
  const { logout } = useAuth()

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <span className={styles.badge}>ADMIN</span>
        <span className={styles.title}>Dossier Control Panel</span>
      </div>
      <div className={styles.right}>
        <button onClick={logout} className={styles.logoutBtn}>
          <span className="material-symbols-outlined">logout</span>
          Logout
        </button>
      </div>
    </header>
  )
}
