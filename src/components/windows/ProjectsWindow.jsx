'use client';
import { useState } from 'react';
import styles from './ProjectsWindow.module.css';
import portfolioData from '@/lib/portfolioData';

const { projects } = portfolioData;

export default function ProjectsWindow() {
  const [selected, setSelected] = useState(null);

  return (
    <div className={styles.wrap}>
      {/* Left: sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTitle}>Project Tasks</div>
        <div className={styles.sidebarLink}>
          <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>folder_open</span>
          View All
        </div>
        <div className={styles.sidebarLink}>
          <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>star</span>
          Favourites
        </div>
      </aside>

      {/* Right: content area */}
      <div className={styles.content}>
        {/* Address bar */}
        <div className={styles.addressBar}>
          <span className={styles.addressLabel}>Address</span>
          <div className={styles.addressInput}>My Projects &gt; All Projects</div>
        </div>

        {!selected ? (
          /* Folder grid */
          <div className={styles.grid}>
            {projects.map((p, i) => (
              <div
                key={i}
                className={styles.folder}
                onDoubleClick={() => setSelected(p)}
                title={`Double-click to open: ${p.title}`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 44, color: p.color, fontVariationSettings: "'FILL' 1", filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.2))' }}
                >{p.icon}</span>
                <span className={styles.folderLabel}>{p.title}</span>
                <div className={styles.folderTags}>
                  {p.tags.slice(0, 2).map((t) => (
                    <span key={t} className={styles.tag}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Project detail */
          <div className={`${styles.detail} xp-scroll`}>
            <button className={styles.backBtn} onClick={() => setSelected(null)}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
              Back to Projects
            </button>
            <div className={styles.detailHeader}>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 48, color: selected.color, fontVariationSettings: "'FILL' 1" }}
              >{selected.icon}</span>
              <div>
                <h2 className={styles.detailTitle}>{selected.title}</h2>
                <div className={styles.detailTags}>
                  {selected.tags.map((t) => (
                    <span key={t} className={styles.tagBig}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.detailDesc}>{selected.description}</div>
            <h3 className={styles.detailSubtitle}>Key Highlights</h3>
            <ul className={styles.highlightList}>
              {selected.highlights.map((h, i) => (
                <li key={i} className={styles.highlightItem}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#266c2d', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
