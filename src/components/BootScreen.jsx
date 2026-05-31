'use client';
import { useEffect, useRef } from 'react';
import styles from './BootScreen.module.css';

export default function BootScreen({ onDone }) {
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(onDone, 4000);
    return () => clearTimeout(timerRef.current);
  }, [onDone]);

  return (
    <div className={styles.boot} onClick={() => { clearTimeout(timerRef.current); onDone(); }}>
      <div className={styles.logoArea}>
        {/* XP Logo SVG inline */}
        <svg viewBox="0 0 200 80" className={styles.xpLogoSvg} xmlns="http://www.w3.org/2000/svg">
          {/* Flag */}
          <rect x="2" y="2" width="28" height="28" rx="3" fill="#d94f3d"/>
          <rect x="32" y="2" width="28" height="28" rx="3" fill="#6bbf3f"/>
          <rect x="2" y="32" width="28" height="28" rx="3" fill="#4a7dbf"/>
          <rect x="32" y="32" width="28" height="28" rx="3" fill="#f5c842"/>
          {/* Windows text */}
          <text x="68" y="30" fontFamily="Arimo, Tahoma, sans-serif" fontWeight="700" fontSize="28"
            fill="url(#wGrad)" letterSpacing="-1">Windows</text>
          {/* XP text */}
          <text x="68" y="55" fontFamily="Arimo, Tahoma, sans-serif" fontWeight="400" fontSize="22"
            fill="#b3c5ff" letterSpacing="2" fontStyle="italic">XP</text>
          <defs>
            <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff"/>
              <stop offset="100%" stopColor="#a0b8f0"/>
            </linearGradient>
          </defs>
        </svg>

        <p className={styles.tagline}>Professional Edition</p>

        {/* XP progress bar */}
        <div className={styles.progressWrap}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.segment} style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>

        <p className={styles.hint}>Click anywhere to skip</p>
      </div>
    </div>
  );
}
