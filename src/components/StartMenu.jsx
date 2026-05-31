'use client';
import { useEffect, useRef } from 'react';
import styles from './StartMenu.module.css';
import portfolioData from '@/lib/portfolioData';

const { personal } = portfolioData;

export default function StartMenu({ user, openWindow, onClose, onLogout }) {
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target) &&
          !document.getElementById('start-btn')?.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const nav = (id) => { openWindow(id); onClose(); };

  return (
    <div className={styles.menu} ref={ref} id="start-menu">
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.avatar}>
          <span className="material-symbols-outlined" style={{ fontSize: 32, color: '#245edb', fontVariationSettings: "'FILL' 1" }}>person</span>
        </div>
        <div>
          <div className={styles.name}>{user ? (user.displayName || user.email) : personal.name}</div>
          {user ? <div className={styles.role}>Signed in</div> : <div className={styles.role}>Guest Mode</div>}
        </div>
      </div>

      {/* Body */}
      <div className={styles.body}>
        {/* Left: Quick launch */}
        <div className={styles.left}>
          <div className={styles.sectionTitle}>Portfolio</div>
          <MenuItem icon="person" label="About Me" sub="Who is Kamal?" onClick={() => nav('about')} />
          <MenuItem icon="folder" label="My Projects" sub="Explore my work" onClick={() => nav('projects')} />
          <MenuItem icon="computer" label="My Computer" sub="Skills & Resume" onClick={() => nav('skills')} />
          <MenuItem icon="mail" label="Contact Me" sub="Get in touch" onClick={() => nav('contact')} />
          <div className={styles.sep} />
          <div className={styles.sectionTitle}>Tools</div>
          <MenuItem icon="search" label="Search" sub="Find anything" onClick={() => nav('search')} />
          {user && user.email === personal.adminEmail && (
            <MenuItem icon="admin_panel_settings" label="Admin Panel" sub="View messages" onClick={() => nav('admin')} />
          )}
        </div>

        {/* Right: Quick links */}
        <div className={styles.right}>
          <div className={styles.sectionTitle}>Quick Links</div>
          <a href={`https://${personal.linkedin}`} target="_blank" rel="noreferrer" className={styles.rightLink}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>work</span>
            LinkedIn
          </a>
          <a href={`https://${personal.github}`} target="_blank" rel="noreferrer" className={styles.rightLink}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>code</span>
            GitHub
          </a>
          <a href={`mailto:${personal.email}`} className={styles.rightLink}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>mail</span>
            Email
          </a>
          <div className={styles.sep} />
          <div className={styles.sectionTitle}>System</div>
          <div className={styles.rightLink} style={{ color: '#ba1a1a' }} onClick={onLogout}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#ba1a1a', fontVariationSettings: "'FILL' 1" }}>power_settings_new</span>
            {user ? 'Log Out' : 'Back to Login'}
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuItem({ icon, label, sub, onClick }) {
  return (
    <button className={styles.menuItem} onClick={onClick}>
      <span className="material-symbols-outlined" style={{ fontSize: 24, color: '#245edb', fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      <span>
        <div className={styles.itemLabel}>{label}</div>
        {sub && <div className={styles.itemSub}>{sub}</div>}
      </span>
    </button>
  );
}
