"use client";
import { useState, useEffect } from "react";
import styles from "./cv.module.css";
import TechIcon from "../../components/Icons/TechIcon";

export default function CVPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const res = await fetch(`${apiUrl}/cv/`);
        const data = await res.json();
        setCv(data);
      } finally {
        setLoading(false);
      }
    };
    fetchCV();
  }, []);

  const sortItems = (items) => {
    if (!items) return [];
    return [...items].sort((a, b) => {
      const getYear = (str) => {
        if (!str) return 0;
        if (str.toLowerCase().includes("present")) return 9999;
        const match = str.match(/\d{4}/);
        return match ? parseInt(match[0]) : 0;
      };
      return getYear(b.period) - getYear(a.period);
    });
  };

  const renderTimeline = (items, placeholder = "Processing dossiers...") => {
    const sortedItems = sortItems(items);
    return (
      <div className={styles.timeline}>
        {sortedItems?.length > 0 ? (
          sortedItems.map((item, idx) => (
            <div key={idx} className={styles.timelineItem}>
              <div className={styles.timelineDot}></div>
              <div className={styles.timelineContent}>
                <span className={styles.timelinePeriod}>{item.period}</span>
                <h3 className={styles.itemTitle}>{item.title}</h3>
                <h4 className={styles.itemCompany}>{item.company}</h4>
                {item.description && (
                  <p className={styles.itemDesc}>{item.description}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className={styles.empty}>{placeholder}</p>
        )}
      </div>
    );
  };

  if (loading)
    return <div className={styles.container}>Assembling Dossier...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.label}>RESUME / CV</div>
        <h1 className={styles.name}>{cv?.title || "Mehmet Büyükgümüş"}</h1>
        <p className={styles.summary}>
          {cv?.summary || "Technical Curator & Software Architect"}
        </p>
      </header>

      <div className={styles.grid}>
        {/* LEFT COLUMN: MAIN CHRONOLOGY */}
        <div className={styles.mainColumn}>
          <div className={styles.topGrid}>
            <section>
              <h2 className={styles.sectionTitle}>Experience</h2>
              {renderTimeline(
                cv?.experience,
                "Professional history pending...",
              )}
            </section>

            <section>
              <h2 className={styles.sectionTitle}>Education</h2>
              {renderTimeline(cv?.education, "Academic records pending...")}
            </section>
          </div>

          {/* EXTRA SECTIONS IN MAIN COLUMN */}
          {cv?.extra_sections?.map((section, sIdx) => (
            <div key={sIdx} style={{ marginTop: "var(--spacing-24)" }}>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              {renderTimeline(section.items, "Section content empty.")}
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN: TECHNICAL INDEX */}
        <aside className={styles.sideColumn}>
          <h2 className={styles.sectionTitle}>Technical Mastery</h2>
          <div className={styles.skills}>
            {cv?.skills?.split(",").map((skill, index) => {
              const name = skill.trim();
              const normalizedName = name
                .toLowerCase()
                .replace(/\s+/g, "")
                .replace(/\./g, "");

              // 1. registry'den ikonu alalım
              const iconValue = cv?.skill_icons?.[normalizedName];

              return (
                <div key={index} className={styles.skillTag}>
                  <div className={styles.skillIcon}>
                    <TechIcon value={iconValue} name={name} />
                  </div>
                  <span>{name}</span>
                </div>
              );
            }) || <p className={styles.empty}>Awaiting skill index...</p>}
          </div>
        </aside>
      </div>
    </div>
  );
}
