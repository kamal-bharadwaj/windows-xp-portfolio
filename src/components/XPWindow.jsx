'use client';
import { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import styles from './XPWindow.module.css';

export default function XPWindow({ id, title, icon, state, onClose, onMinimize, onFocus, onMove, onResize, children }) {
  const { minimized, zIndex, x, y, w, h } = state;
  const [maximized, setMaximized] = useState(false);
  const [localActive, setLocalActive] = useState(!minimized);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const resizing = useRef(false);
  const startSize = useRef({ w: 0, h: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const windowRef = useRef(null);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 1. Entrance animation on mount
  useEffect(() => {
    if (windowRef.current) {
      gsap.fromTo(
        windowRef.current,
        { scale: 0.35, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.15)' }
      );
    }
  }, []);

  // 2. Handle Minimize & Restore transition
  const prevMinimized = useRef(minimized);
  useEffect(() => {
    if (prevMinimized.current !== minimized) {
      prevMinimized.current = minimized;
      if (minimized) {
        // Minimize animation
        gsap.to(windowRef.current, {
          scale: 0.1,
          opacity: 0,
          y: window.innerHeight - y - 100,
          x: (window.innerWidth / 2) - x - 150,
          duration: 0.25,
          ease: 'power2.in',
          onComplete: () => {
            setLocalActive(false);
          }
        });
      } else {
        // Restore animation — clear GSAP transforms first so position resets correctly
        setLocalActive(true);
        requestAnimationFrame(() => {
          if (windowRef.current) {
            gsap.set(windowRef.current, { clearProps: 'all' });
            gsap.fromTo(
              windowRef.current,
              { scale: 0.3, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.3)' }
            );
          }
        });
      }
    }
  }, [minimized, x, y]);

  // 3. Handle Close animation
  const handleClose = () => {
    gsap.to(windowRef.current, {
      scale: 0.5,
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: onClose
    });
  };

  const handleMouseDown = (e) => {
    if (maximized || isMobile) return;
    dragging.current = true;
    setIsDragging(true);
    offset.current = { x: e.clientX - x, y: e.clientY - y };
    onFocus();
    e.preventDefault();
  };

  const handleResizeMouseDown = (e) => {
    e.stopPropagation();
    resizing.current = true;
    startSize.current = { w, h };
    startPos.current = { x: e.clientX, y: e.clientY };
    onFocus();
    e.preventDefault();
  };

  useEffect(() => {
    const onMouseMove = (e) => {
      if (dragging.current && !isMobile) {
        // Clamp so window can't go off-screen or behind taskbar
        const TASKBAR_H = 30;
        const nx = Math.max(0, Math.min(e.clientX - offset.current.x, window.innerWidth - w));
        const ny = Math.max(0, Math.min(e.clientY - offset.current.y, window.innerHeight - TASKBAR_H - 30));
        onMove(nx, ny);
      } else if (resizing.current && !isMobile) {
        const dw = e.clientX - startPos.current.x;
        const dh = e.clientY - startPos.current.y;
        const MIN_W = 280;
        const MIN_H = 180;
        const nw = Math.max(MIN_W, startSize.current.w + dw);
        const nh = Math.max(MIN_H, startSize.current.h + dh);
        onResize(nw, nh);
      }
    };
    const onUp = () => {
      dragging.current = false;
      resizing.current = false;
      setIsDragging(false);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [onMove, onResize, w, h, isMobile]);

  const windowStyle = {
    zIndex,
    display: minimized && !localActive ? 'none' : 'flex',
    ...(maximized || isMobile
      ? { top: 0, left: 0, width: '100%', height: '100%' }
      : { top: y, left: x, width: w, height: h })
  };

  return (
    <div
      ref={windowRef}
      className={`${styles.window} ${isDragging ? '' : styles.transitioning}`}
      style={windowStyle}
      onMouseDown={onFocus}
    >
      {/* Title Bar */}
      <div className={styles.titlebar} onMouseDown={handleMouseDown} onDoubleClick={() => !isMobile && setMaximized(p => !p)}>
        <div className={styles.titleLeft}>
          <img src={icon} className={styles.titleIcon} alt="" />
          <span className={styles.titleText}>{title}</span>
        </div>
        <div className={styles.titleBtns} onMouseDown={(e) => e.stopPropagation()}>
          <button className={styles.minBtn} onClick={onMinimize} title="Minimize">
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>remove</span>
          </button>
          {!isMobile && (
            <button className={styles.maxBtn} onClick={() => setMaximized(p => !p)} title={maximized ? 'Restore' : 'Maximize'}>
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                {maximized ? 'filter_none' : 'check_box_outline_blank'}
              </span>
            </button>
          )}
          <button className={styles.closeBtn} onClick={handleClose} title="Close">
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

      {/* Resizer grip at bottom-right */}
      {!isMobile && !maximized && (
        <div 
          className={styles.resizer} 
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </div>
  );
}
