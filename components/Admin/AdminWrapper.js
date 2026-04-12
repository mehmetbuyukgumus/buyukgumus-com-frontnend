'use client'
import { useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useRouter } from 'next/navigation'
import AdminNavbar from './AdminNavbar'
import AdminSidebar from './AdminSidebar'
import styles from '../../app/admin/dashboard/admin.module.css'

export default function AdminWrapper({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const adminPath = process.env.NEXT_PUBLIC_ADMIN_PATH || 'admin'

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/${adminPath}/login`)
    }
  }, [user, loading, router, adminPath])

  if (loading || !user) {
    return <div className={styles.loading}>Verifying identity...</div>
  }

  return (
    <div className={styles.adminContainer}>
      <AdminNavbar />
      <div className={styles.contentWrapper}>
        <AdminSidebar />
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </div>
  )
}
