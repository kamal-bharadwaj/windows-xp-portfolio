'use client';
import styles from './Taskbar.module.css';
import { useEffect, useState } from 'react';

export default function Taskbar({ windows, windowDefs, startMenuOpen, onStartClick, onTaskClick, cursorTrailEnabled, onToggleCursorTrail }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      let h = now.getHours();
      const m = now.getMinutes().toString().padStart(2, '0');
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      setTime(`${h}:${m} ${ampm}`);
    };
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, []);

  const openWindows = Object.entries(windows);

  return (
    <div className={styles.taskbar} id="taskbar">
      {/* Start Button */}
      <button
        className={`${styles.startBtn} ${startMenuOpen ? styles.startActive : ''}`}
        onClick={onStartClick}
        id="start-btn"
        aria-label="Start Menu"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>window</span>
        <span className={styles.startLabel}>start</span>
      </button>

      {/* Task Buttons */}
      <div className={styles.tasks}>
        {openWindows.map(([id, state]) => {
          const def = windowDefs[id];
          if (!def) return null;
          return (
            <button
              key={id}
              className={`${styles.taskBtn} ${!state.minimized ? styles.taskActive : ''}`}
              onClick={() => onTaskClick(id)}
              title={def.title}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>{def.icon}</span>
              <span className={styles.taskLabel}>{def.title.split('—')[0].trim()}</span>
            </button>
          );
        })}
      </div>

      {/* System Tray */}
      <div className={styles.tray}>
        <button
          onClick={onToggleCursorTrail}
          className={styles.trayBtn}
          title={`Cursor Trails: ${cursorTrailEnabled ? 'ON' : 'OFF'} (Click to toggle)`}
          aria-label="Toggle Cursor Trails"
        >
          <span 
            className="material-symbols-outlined" 
            style={{ 
              fontSize: 16, 
              color: '#fff', 
              opacity: cursorTrailEnabled ? 1 : 0.4 
            }}
          >
            mouse
          </span>
        </button>
        <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#fff' }}>wifi</span>
        <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#fff' }}>volume_up</span>
        <span className={styles.clock}>{time}</span>
      </div>
    </div>
  );
}
