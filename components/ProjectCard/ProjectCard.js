'use client'
import { FaGithub } from 'react-icons/fa';
import { TbWorldWww } from 'react-icons/tb';
import styles from './ProjectCard.module.css';
import TechIcon from '../Icons/TechIcon';

/**
 * --------------------------------------------------------------------------
 * PROJECT CARD COMPONENT
 * --------------------------------------------------------------------------
 * Rendered across Homepage and Projects Gallery.
 * Synchronized with Universal Icon Registry for iconography.
 * --------------------------------------------------------------------------
 */
export default function ProjectCard({ project, skillIcons = {} }) {
  const normalizeUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  const githubUrl = normalizeUrl(project.github_url);
  const liveUrl = normalizeUrl(project.live_url);

  // Split tech_stack by comma
  const techStackArr = project.tech_stack 
    ? project.tech_stack.split(',').map(s => s.trim()).filter(s => s) 
    : [];

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className="material-symbols-outlined">terminal</span>
          <h4 className={styles.title}>{project.title}</h4>
        </div>
        <div className={styles.links}>
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" title="View Source">
              <FaGithub />
            </a>
          )}
          {liveUrl && (
            <a href={liveUrl} target="_blank" rel="noopener noreferrer" title="Live Demo">
              <TbWorldWww />
            </a>
          )}
        </div>
      </div>
      
      <p className={styles.description}>{project.description}</p>
      
      <div className={styles.footer}>
        <div className={styles.techList}>
          {techStackArr.map((tech, idx) => {
            const normalizedName = tech.toLowerCase().trim().replace(/\s+/g, '').replace(/\./g, '');
            const value = skillIcons[normalizedName] || null;
            
            return (
              <div key={idx} className={styles.techItem} title={tech}>
                <div style={{ width: '20px', height: '20px' }}>
                  <TechIcon value={value} name={tech} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
