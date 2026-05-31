'use client';
import styles from './DesktopIcons.module.css';
import portfolioData from '@/lib/portfolioData';

const { personal } = portfolioData;

const ICONS = [
  { id: 'about',    label: 'About Me',     icon: 'person',        color: '#245edb' },
  { id: 'projects', label: 'My Projects',  icon: 'folder',        color: '#f5a623' },
  { id: 'skills',   label: 'My Computer',  icon: 'computer',      color: '#737686' },
  { id: 'contact',  label: 'Contact Me',   icon: 'mail',          color: '#3c813f' },
  { id: 'search',   label: 'Search',       icon: 'search',        color: '#8e2f00' },
  {
    id: 'github',
    label: 'GitHub',
    icon: 'code',
    color: '#1c1c12',
    href: `https://${personal.github}`,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: 'work',
    color: '#0077b5',
    href: `https://${personal.linkedin}`,
  },
  {
    id: 'resume',
    label: 'Resume.pdf',
    icon: 'description',
    color: '#ba1a1a',
  },
];

export default function DesktopIcons({ openWindow }) {
  const handleClick = (icon) => {
    if (icon.href) {
      window.open(icon.href, '_blank', 'noopener');
    } else {
      openWindow(icon.id);
    }
  };

  return (
    <div className={styles.grid}>
      {ICONS.map((icon) => (
        <div
          key={icon.id}
          className={styles.icon}
          onDoubleClick={() => handleClick(icon)}
          onClick={(e) => {
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
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 40, color: icon.color, fontVariationSettings: "'FILL' 1", filter: 'drop-shadow(1px 2px 4px rgba(0,0,0,0.5))' }}
            >
              {icon.icon}
            </span>
          </div>
          <span className={styles.label}>{icon.label}</span>
        </div>
      ))}
    </div>
  );
}
