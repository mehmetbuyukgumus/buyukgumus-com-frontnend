'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './AdminSidebar.module.css'

export default function AdminSidebar() {
  const pathname = usePathname()
  const adminPath = process.env.NEXT_PUBLIC_ADMIN_PATH || 'admin'

  const navItems = [
    { name: 'Dashboard', icon: 'dashboard', path: `/${adminPath}/dashboard` },
    { name: 'Projects', icon: 'terminal', path: `/${adminPath}/projects` },
    { name: 'Articles', icon: 'article', path: `/${adminPath}/articles` },
    { name: 'CV / Profile', icon: 'description', path: `/${adminPath}/cv` },
    { name: 'Universal Icons', icon: 'category', path: `/${adminPath}/icons` },
  ]


  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path} 
            className={`${styles.navItem} ${pathname === item.path ? styles.active : ''}`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
      <div className={styles.footer}>
        <Link href="/" className={styles.backBtn}>
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Site
        </Link>
      </div>
    </aside>
  )
}
