'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './DesktopIcons.module.css';
import portfolioData from '@/lib/portfolioData';

const { personal } = portfolioData;

const ICONS = [
  { id: 'about',    label: 'About Me',     icon: '/icons/xp_about.svg' },
  { id: 'projects', label: 'My Projects',  icon: '/icons/xp_projects.svg' },
  { id: 'skills',   label: 'My Computer',  icon: '/icons/xp_mycomputer.svg' },
  { id: 'contact',  label: 'Contact Me',   icon: '/icons/xp_contact.svg' },
  { id: 'search',   label: 'Search',       icon: '/icons/xp_search.svg' },
  {
    id: 'github',
    label: 'GitHub',
    icon: '/icons/xp_github.svg',
    href: `https://${personal.github}`,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: '/icons/xp_linkedin.svg',
    href: `https://${personal.linkedin}`,
  },
  {
    id: 'resume',
    label: 'Resume.pdf',
    icon: '/icons/xp_resume.svg',
    href: '/resume/resume.pdf',
  },
];

export default function DesktopIcons({ openWindow }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        `.${styles.icon}`,
        {
          opacity: 0,
          scale: 0.5,
          y: 30,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'back.out(1.5)',
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleClick = (icon) => {
    if (icon.href) {
      window.open(icon.href, '_blank', 'noopener');
    } else {
      openWindow(icon.id);
    }
  };

  return (
    <div className={styles.grid} ref={containerRef}>
      {ICONS.map((icon) => (
        <div
          key={icon.id}
          className={styles.icon}
          onDoubleClick={() => handleClick(icon)}
          onClick={(e) => {
            if (window.innerWidth <= 768) {
              handleClick(icon);
              return;
            }
            // single click selects, double click opens
            const el = e.currentTarget;
            el.classList.toggle(styles.selected);
            // deselect all others
            document.querySelectorAll(`.${styles.selected}`).forEach((other) => {
              if (other !== el) other.classList.remove(styles.selected);
            });
          }}
          title={`Double-click to open ${icon.label}`}
        >
          <div className={styles.iconImg}>
            <img
              src={icon.icon}
              className={styles.iconPng}
              alt=""
            />
          </div>
          <span className={styles.label}>{icon.label}</span>
        </div>
      ))}
    </div>
  );
}
