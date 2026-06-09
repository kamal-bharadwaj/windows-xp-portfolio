'use client';
import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import styles from './BootScreen.module.css';

export default function BootScreen({ onDone }) {
  const containerRef = useRef(null);
  const timerRef = useRef(null);

  const handleFinish = useCallback(() => {
    if (!containerRef.current) {
      onDone();
      return;
    }
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: onDone,
    });
  }, [onDone]);

  useEffect(() => {
    timerRef.current = setTimeout(handleFinish, 4000);
    return () => clearTimeout(timerRef.current);
  }, [handleFinish]);

  return (
    <div ref={containerRef} className={styles.boot} onClick={() => { clearTimeout(timerRef.current); handleFinish(); }}>
      <div className={styles.logoArea}>
        <div className={styles.logoContainer}>
          <img src="/xp_logo.svg" className={styles.xpLogoImg} alt="Windows XP Logo" />
          <div className={styles.titleContainer}>
            <span className={styles.winTitle}>Windows</span>
            <span className={styles.xpTitle}>XP</span>
          </div>
        </div>

        <p className={styles.tagline}>Professional Edition</p>

        {/* XP progress bar */}
        <div className={styles.progressWrap}>
          <div className={styles.barGroup}>
            <div className={styles.segment} />
            <div className={styles.segment} />
            <div className={styles.segment} />
          </div>
        </div>

        <p className={styles.hint}>Click anywhere to skip</p>
      </div>
    </div>
  );
}
