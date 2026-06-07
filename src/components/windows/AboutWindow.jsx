'use client';
import { useEffect, useRef } from 'react';
import styles from './AboutWindow.module.css';
import { usePortfolioData } from '@/lib/PortfolioContext';

export default function AboutWindow({ openWindow }) {
  const { data } = usePortfolioData();
  const { personal, awards } = data;
  const progressRef = useRef(null);

  // Animate progress bars from 0 on mount
  useEffect(() => {
    if (!progressRef.current) return;
    const fills = progressRef.current.querySelectorAll('[data-width]');
    // Start at 0
    fills.forEach(el => { el.style.width = '0%'; });
    // Then animate to target after a tiny paint delay
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        fills.forEach(el => {
          el.style.width = el.dataset.width;
        });
      });
    });
  }, []);

  return (
    <div className={styles.wrap}>
      {/* Left Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.avatarBox}>
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 80, color: '#245edb', fontVariationSettings: "'FILL' 1" }}
          >person</span>
        </div>
        <div className={styles.infoBox}>
          <h3 className={styles.infoTitle}>System Info</h3>
          <div className={styles.infoRow}><strong>Name:</strong> {personal.name}</div>
          <div className={styles.infoRow}><strong>Role:</strong> {personal.title}</div>
          <div className={styles.infoRow}><strong>Status:</strong> <span style={{ color: '#266c2d', fontWeight: 700 }}>● Online</span></div>
          <div className={styles.infoRow}><strong>SGPA:</strong> {personal.sgpa}</div>
          <div className={styles.infoRow}><strong>Location:</strong> {personal.location}</div>
        </div>
        <button className={styles.contactBtn} onClick={() => openWindow('contact')}>
          <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>mail</span>
          Contact Me
        </button>
        <div className={styles.socialLinks}>
          <a href={`https://${personal.linkedin}`} target="_blank" rel="noreferrer" className={styles.socialLink}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>work</span> LinkedIn
          </a>
          <a href={`https://${personal.github}`} target="_blank" rel="noreferrer" className={styles.socialLink}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>code</span> GitHub
          </a>
        </div>
      </aside>

      {/* Right Content */}
      <div className={`${styles.main} xp-scroll`}>
        <div className={styles.section}>
          <h2 className={styles.mainTitle}>About {personal.name}</h2>
          <p className={styles.bio}>{personal.bio}</p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.secTitle}>Contact Details</h3>
          <div className={styles.contactGrid}>
            <div className={styles.contactItem}>
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#245edb', fontVariationSettings: "'FILL' 1" }}>phone</span>
              <a href={`tel:${personal.phone}`} className={styles.contactVal}>{personal.phone}</a>
            </div>
            <div className={styles.contactItem}>
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#245edb', fontVariationSettings: "'FILL' 1" }}>mail</span>
              <a href={`mailto:${personal.email}`} className={styles.contactVal}>{personal.email}</a>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.secTitle}>🏆 Awards & Achievements</h3>
          <ul className={styles.awardList}>
            {awards.map((a, i) => (
              <li key={i} className={styles.awardItem}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#f5a623', fontVariationSettings: "'FILL' 1" }}>{a.icon}</span>
                {a.text}
              </li>
            ))}
          </ul>
        </div>

        {/* XP Progress */}
        <div className={styles.section} ref={progressRef}>
          <h3 className={styles.secTitle}>Skill Deployment Progress</h3>
          {[
            { label: 'AI & Machine Learning', pct: 88 },
            { label: 'Full-Stack Development', pct: 85 },
            { label: 'Problem Solving', pct: 90 },
            { label: 'Research & Publications', pct: 80 },
          ].map((p) => (
            <div key={p.label} className={styles.progressRow}>
              <div className={styles.progressLabel}>{p.label}</div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} data-width={`${p.pct}%`} style={{ width: `${p.pct}%` }} />
              </div>
              <div className={styles.progressPct}>{p.pct}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
