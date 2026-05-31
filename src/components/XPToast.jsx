'use client';
import { useEffect } from 'react';
import styles from './XPToast.module.css';

export default function XPToast({ toast }) {
  if (!toast) return null;

  const icons = { success: 'check_circle', error: 'error', info: 'info' };
  const colors = { success: '#266c2d', error: '#ba1a1a', info: '#245edb' };

  return (
    <div className={styles.toast} role="alert">
      <span
        className="material-symbols-outlined"
        style={{ fontSize: 20, color: colors[toast.type] || colors.info, fontVariationSettings: "'FILL' 1", flexShrink: 0 }}
      >{icons[toast.type] || icons.info}</span>
      <span className={styles.msg}>{toast.msg}</span>
    </div>
  );
}
