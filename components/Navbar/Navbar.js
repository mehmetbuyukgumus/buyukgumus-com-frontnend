import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <header className={`${styles.header} glass`}>
      <div className={styles.container}>
        <div className={styles.logoGroup}>
          <Link href="/" className={styles.logo}>
            <span>BG </span>
            <span>Dev</span>
          </Link>
        </div>
        <nav className={styles.nav}>
          <Link href="/projects">Projects</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/cv">CV</Link>
        </nav>
      </div>
    </header>
  );
}
