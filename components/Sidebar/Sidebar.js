import { FaGithub, FaLinkedin } from "react-icons/fa";
import { TbMailOpenedFilled } from "react-icons/tb";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  return (
    <aside className={`${styles.sidebar} glass`}>
      <div className={styles.profile}>
        <div className={styles.avatar}>
          <img src="/assets/darkpp.png" alt="Mehmet Buyukgumus" />
        </div>
        <h1 className={styles.name}>Mehmet Büyükgümüş</h1>
        <p className={styles.role}>Struggling...</p>
      </div>
      <div className={styles.social}>
        <div className={styles.iconGroup}>
          <a
            href="https://github.com/mehmetbuyukgumus"
            target="_blank"
            title="GitHub"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/mbuyukgumus/"
            target="_blank"
            title="LinkedIn"
          >
            <FaLinkedin />
          </a>
          <a href="mailto:mehmet@buyukgumus.com" title="Email">
            <TbMailOpenedFilled />
          </a>
        </div>
        <p className={styles.copyright}>© {new Date().getFullYear()} BGDev</p>
      </div>
    </aside>
  );
}
