'use client';
import { useState } from 'react';
import styles from './SkillsWindow.module.css';
import { usePortfolioData } from '@/lib/PortfolioContext';

const TABS = ['Skills', 'Education', 'Experience'];

export default function SkillsWindow() {
  const { data } = usePortfolioData();
  const { skills, education, experience } = data;
  const [activeTab, setActiveTab] = useState('Skills');

  return (
    <div className={styles.wrap}>
      {/* Tabs */}
      <div className={styles.tabs}>
        {TABS.map((t) => (
          <button
            key={t}
            className={`${styles.tab} ${activeTab === t ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(t)}
          >{t}</button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={`${styles.content} xp-scroll`}>

        {/* ── SKILLS ── */}
        {activeTab === 'Skills' && (
          <div className={styles.skillsWrap}>
            <div className={styles.sysHeader}>
              <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#737686', fontVariationSettings: "'FILL' 1" }}>computer</span>
              <div>
                <div className={styles.sysTitle}>Kamal Kumar's Skill System</div>
                <div className={styles.sysVer}>Windows XP Professional · Build 2026</div>
              </div>
            </div>
            {Object.entries(skills).map(([category, items]) => (
              <div key={category} className={styles.skillSection}>
                <div className={styles.skillCategoryTitle}>{category}</div>
                <div className={styles.chips}>
                  {items.map((item) => (
                    <span key={item} className={styles.chip}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── EDUCATION ── */}
        {activeTab === 'Education' && (
          <div className={styles.sectionWrap}>
            <h2 className={styles.sectionHeading}>Education</h2>
            <div className={styles.timeline}>
              {education.map((e, i) => (
                <div key={i} className={styles.timelineItem}>
                  <div className={styles.dot} />
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineDate}>{e.period}</div>
                    <div className={styles.timelineTitle}>{e.degree}</div>
                    {e.minor && <div className={styles.timelineSub}>{e.minor}</div>}
                    <div className={styles.timelineOrg}>{e.institution}</div>
                    <div className={styles.timelineScore}>{e.score}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── EXPERIENCE ── */}
        {activeTab === 'Experience' && (
          <div className={styles.sectionWrap}>
            <h2 className={styles.sectionHeading}>Professional Experience</h2>
            <div className={styles.timeline}>
              {experience.map((exp, i) => (
                <div key={i} className={styles.timelineItem}>
                  <div className={styles.dot} />
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineDate}>{exp.period}</div>
                    <div className={styles.timelineTitle}>{exp.role}</div>
                    <div className={styles.timelineOrg}>{exp.org}</div>
                    <div className={styles.timelineSub}>{exp.location}</div>
                    <ul className={styles.hlList}>
                      {exp.highlights.map((h, j) => (
                        <li key={j} className={styles.hlItem}>
                          <span className="material-symbols-outlined" style={{ fontSize: 12, color: '#266c2d', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
