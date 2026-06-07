'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './StartMenu.module.css';
import portfolioData from '@/lib/portfolioData';

const { personal } = portfolioData;

export default function StartMenu({ user, openWindow, onClose, onLogout }) {
  const ref = useRef(null);

  // Custom close handler with GSAP animation before unmounting
  const handleClose = () => {
    if (!ref.current) {
      onClose();
      return;
    }
    gsap.to(ref.current, {
      y: 100,
      opacity: 0,
      scale: 0.95,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: onClose,
    });
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target) &&
          !document.getElementById('start-btn')?.contains(e.target)) {
        handleClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  // Slide up on mount
  useEffect(() => {
    gsap.fromTo(
      ref.current,
      { y: 100, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: 'back.out(1.1)',
      }
    );
  }, []);

  const nav = (id) => {
    openWindow(id);
    handleClose();
  };

  const handleLogoutClick = () => {
    handleClose();
    setTimeout(onLogout, 250);
  };

  return (
    <div className={styles.menu} ref={ref} id="start-menu">
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.avatar}>
          <img src="/icons/xp_avatar.svg" className={styles.avatarImg} alt="" />
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
          <MenuItem icon="/icons/xp_about.svg" label="About Me" sub="Who is Kamal?" onClick={() => nav('about')} />
          <MenuItem icon="/icons/xp_projects.svg" label="My Projects" sub="Explore my work" onClick={() => nav('projects')} />
          <MenuItem icon="/icons/xp_mycomputer.svg" label="My Computer" sub="Skills & Resume" onClick={() => nav('skills')} />
          <MenuItem icon="/icons/xp_contact.svg" label="Contact Me" sub="Get in touch" onClick={() => nav('contact')} />
          <div className={styles.sep} />
          <div className={styles.sectionTitle}>Tools</div>
          <MenuItem icon="/icons/xp_search.svg" label="Search" sub="Find anything" onClick={() => nav('search')} />
          {user && user.email === personal.adminEmail && (
            <MenuItem icon="/icons/xp_admin.svg" label="Admin Panel" sub="View messages" onClick={() => nav('admin')} />
          )}
        </div>

        {/* Right: Quick links */}
        <div className={styles.right}>
          <div className={styles.sectionTitle}>Quick Links</div>
          <a href={`https://${personal.linkedin}`} target="_blank" rel="noreferrer" className={styles.rightLink}>
            <img src="/icons/xp_linkedin.svg" className={styles.rightIcon} alt="" />
            LinkedIn
          </a>
          <a href={`https://${personal.github}`} target="_blank" rel="noreferrer" className={styles.rightLink}>
            <img src="/icons/xp_github.svg" className={styles.rightIcon} alt="" />
            GitHub
          </a>
          <a href={`mailto:${personal.email}`} className={styles.rightLink}>
            <img src="/icons/xp_contact.svg" className={styles.rightIcon} alt="" />
            Email
          </a>
          <div className={styles.sep} />
          <div className={styles.sectionTitle}>System</div>
          <div className={styles.rightLink} style={{ color: '#ba1a1a' }} onClick={handleLogoutClick}>
            <img src="/icons/xp_power.svg" className={styles.rightIcon} alt="" />
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
      <img src={icon} className={styles.itemIcon} alt="" />
      <span>
        <div className={styles.itemLabel}>{label}</div>
        {sub && <div className={styles.itemSub}>{sub}</div>}
      </span>
    </button>
  );
}
