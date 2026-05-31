'use client';
import { useRef, useState, useEffect } from 'react';
import styles from './XPWindow.module.css';

export default function XPWindow({ id, title, icon, state, onClose, onMinimize, onFocus, onMove, children }) {
  const { minimized, zIndex, x, y, w, h } = state;
  const [maximized, setMaximized] = useState(false);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const windowRef = useRef(null);

  const handleMouseDown = (e) => {
    if (maximized) return;
    dragging.current = true;
    offset.current = { x: e.clientX - x, y: e.clientY - y };
    onFocus();
    e.preventDefault();
  };

  useEffect(() => {
    const onMove2 = (e) => {
      if (!dragging.current) return;
      const nx = Math.max(0, e.clientX - offset.current.x);
      const ny = Math.max(0, e.clientY - offset.current.y);
      onMove(nx, ny);
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMove2);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove2);
      window.removeEventListener('mouseup', onUp);
    };
  }, [onMove]);

  if (minimized) return null;

  const windowStyle = maximized
    ? { top: 0, left: 0, width: '100vw', height: 'calc(100vh - 30px)', zIndex }
    : { top: y, left: x, width: w, height: h, zIndex };

  return (
    <div
      ref={windowRef}
      className={styles.window}
      style={windowStyle}
      onMouseDown={onFocus}
    >
      {/* Title Bar */}
      <div className={styles.titlebar} onMouseDown={handleMouseDown} onDoubleClick={() => setMaximized(p => !p)}>
        <div className={styles.titleLeft}>
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#fff', fontVariationSettings: "'FILL' 1" }}>{icon}</span>
          <span className={styles.titleText}>{title}</span>
        </div>
        <div className={styles.titleBtns} onMouseDown={(e) => e.stopPropagation()}>
          <button className={styles.minBtn} onClick={onMinimize} title="Minimize">
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>remove</span>
          </button>
          <button className={styles.maxBtn} onClick={() => setMaximized(p => !p)} title={maximized ? 'Restore' : 'Maximize'}>
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
              {maximized ? 'filter_none' : 'check_box_outline_blank'}
            </span>
          </button>
          <button className={styles.closeBtn} onClick={onClose} title="Close">
            <span className="material-symbols-outlined" style={{ fontSize: 13, fontWeight: 900 }}>close</span>
          </button>
        </div>
      </div>

      {/* Menu Bar */}
      <div className={styles.menubar}>
        {['File', 'Edit', 'View', 'Help'].map((m) => (
          <span key={m} className={styles.menuItem}>{m}</span>
        ))}
      </div>

      {/* Content */}
      <div className={`${styles.content} xp-scroll`}>
        {children}
      </div>

      {/* Status Bar */}
      <div className={styles.statusbar}>
        <span className="material-symbols-outlined" style={{ fontSize: 12, color: '#737686' }}>check_circle</span>
        <span>Ready</span>
      </div>
    </div>
  );
}
