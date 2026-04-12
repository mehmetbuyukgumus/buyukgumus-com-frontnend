'use client'
import { useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { useRouter } from 'next/navigation'
import AdminNavbar from '../../../components/Admin/AdminNavbar'
import AdminSidebar from '../../../components/Admin/AdminSidebar'
import styles from './admin.module.css'
import dashStyles from './dashboard.module.css'

export default function AdminDashboard() {
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
          <div className={dashStyles.welcome}>
            <h1>Welcome, Mehmet</h1>
            <p>Your technical dossier is under your control.</p>
          </div>

          <div className={dashStyles.billingSection}>
            <h2 className={dashStyles.sectionHeader}>
              <span className="material-symbols-outlined">payments</span> 
              Operational Summary (v1.0)
            </h2>
            <div className={dashStyles.billingGrid}>
              <div className={dashStyles.billingCard}>
                <div className={dashStyles.billingHeader}>
                  <span className="material-symbols-outlined">language</span>
                  <h4>Domain Ops</h4>
                </div>
                <div className={dashStyles.billingValue}>$0.00</div>
                <p className={dashStyles.billingLabel}>Active Domains: 0</p>
                <div className={dashStyles.progressTrack}><div className={dashStyles.progressBar} style={{width: '0%'}}></div></div>
              </div>

              <div className={dashStyles.billingCard}>
                <div className={dashStyles.billingHeader}>
                  <span className="material-symbols-outlined">dns</span>
                  <h4>Infrastructure</h4>
                </div>
                <div className={dashStyles.billingValue}>$0.00</div>
                <p className={dashStyles.billingLabel}>Server Health: 100%</p>
                <div className={dashStyles.progressTrack}><div className={dashStyles.progressBar} style={{width: '100%', backgroundColor: '#00e5ff'}}></div></div>
              </div>

              <div className={dashStyles.billingCard}>
                <div className={dashStyles.billingHeader}>
                  <span className="material-symbols-outlined">code</span>
                  <h4>Dev & Support</h4>
                </div>
                <div className={dashStyles.billingValue}>$0.00</div>
                <p className={dashStyles.billingLabel}>Consulting Hours: 0</p>
                <div className={dashStyles.progressTrack}><div className={dashStyles.progressBar} style={{width: '0%'}}></div></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
