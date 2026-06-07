'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './XPToast.module.css';

export default function XPToast({ toast }) {
  const ref = useRef(null);

  useEffect(() => {
    if (toast && ref.current) {
      gsap.fromTo(
        ref.current,
        { y: 50, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.2)' }
      );
    }
  }, [toast]);

  if (!toast) return null;

  const icons = { success: 'check_circle', error: 'error', info: 'info' };
  const colors = { success: '#266c2d', error: '#ba1a1a', info: '#245edb' };

  return (
    <div className={styles.toast} ref={ref} role="alert">
      <span
        className="material-symbols-outlined"
        style={{ fontSize: 20, color: colors[toast.type] || colors.info, fontVariationSettings: "'FILL' 1", flexShrink: 0 }}
      >{icons[toast.type] || icons.info}</span>
      <span className={styles.msg}>{toast.msg}</span>
    </div>
  );
}
