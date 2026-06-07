'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';
import styles from './XPDesktop.module.css';
import BootScreen from './BootScreen';
import LoginScreen from './LoginScreen';
import Taskbar from './Taskbar';
import StartMenu from './StartMenu';
import DesktopIcons from './DesktopIcons';
import WindowManager from './WindowManager';
import XPToast from './XPToast';
import CursorTrail from './CursorTrail';
import { PortfolioProvider } from '@/lib/PortfolioContext';
import { onAuthChange, logout } from '@/lib/firebase';

// ─── Window Registry ───────────────────────────────────────────
const WINDOWS = {
  about:    { title: 'About Me — Portfolio.exe',         icon: '/icons/xp_about.svg',       defaultW: 680, defaultH: 500 },
  projects: { title: 'My Projects',                      icon: '/icons/xp_projects.svg',    defaultW: 780, defaultH: 520 },
  skills:   { title: 'My Computer — Skills & Resume',    icon: '/icons/xp_mycomputer.svg',  defaultW: 740, defaultH: 560 },
  contact:  { title: 'Contact Me',                       icon: '/icons/xp_contact.svg',     defaultW: 560, defaultH: 480 },
  search:   { title: 'Search Companion',                 icon: '/icons/xp_search.svg',      defaultW: 380, defaultH: 480 },
  admin:    { title: 'Portfolio Admin Panel',             icon: '/icons/xp_admin.svg',       defaultW: 850, defaultH: 600 },
};

export default function XPDesktop() {
  const [phase, setPhase] = useState('boot'); // 'boot' | 'login' | 'desktop'
  const [user, setUser] = useState(null);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [windows, setWindows] = useState({});   // id → { minimized, zIndex, x, y, w, h }
  const [zTop, setZTop] = useState(100);
  const [toast, setToast] = useState(null);
  const desktopRef = useRef(null);

  // Firebase auth listener
  useEffect(() => {
    const unsub = onAuthChange((u) => setUser(u));
    return unsub;
  }, []);

  // Fade in desktop when it activates
  useEffect(() => {
    if (phase === 'desktop' && desktopRef.current) {
      gsap.fromTo(
        desktopRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, [phase]);

  // ─── Boot complete ──────────────────────────────────────────
  const handleBootDone = () => setPhase('login');

  // ─── Login complete ─────────────────────────────────────────
  const handleLoginDone = () => setPhase('desktop');

  // ─── Toast helper ────────────────────────────────────────────
  const showToast = useCallback((msg, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const [cursorTrailEnabled, setCursorTrailEnabled] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('xp_cursor_trail');
    if (stored !== null) {
      setCursorTrailEnabled(stored === 'true');
    }
  }, []);

  const toggleCursorTrail = useCallback(() => {
    setCursorTrailEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('xp_cursor_trail', next.toString());
      showToast(`Cursor Trails: ${next ? 'ON' : 'OFF'}`, 'success');
      return next;
    });
  }, [showToast]);

  // ─── Open window ─────────────────────────────────────────────
  const openWindow = useCallback((id) => {
    const cfg = WINDOWS[id];
    if (!cfg) return;
    const newZ = zTop + 1;
    setZTop(newZ);
    setWindows((prev) => {
      if (prev[id]) {
        // already open — restore and focus
        return { ...prev, [id]: { ...prev[id], minimized: false, zIndex: newZ } };
      }
      // center on screen
      const x = Math.max(20, (window.innerWidth  - cfg.defaultW) / 2 + Math.random() * 40 - 20);
      const y = Math.max(20, (window.innerHeight - cfg.defaultH) / 2 + Math.random() * 40 - 20);
      return {
        ...prev,
        [id]: { minimized: false, zIndex: newZ, x, y, w: cfg.defaultW, h: cfg.defaultH },
      };
    });
    setStartMenuOpen(false);
  }, [zTop]);

  // ─── Close window ────────────────────────────────────────────
  const closeWindow = useCallback((id) => {
    setWindows((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  // ─── Minimize window ─────────────────────────────────────────
  const minimizeWindow = useCallback((id) => {
    setWindows((prev) => ({ ...prev, [id]: { ...prev[id], minimized: true } }));
  }, []);

  // ─── Focus window ────────────────────────────────────────────
  const focusWindow = useCallback((id) => {
    const newZ = zTop + 1;
    setZTop(newZ);
    setWindows((prev) => ({ ...prev, [id]: { ...prev[id], zIndex: newZ, minimized: false } }));
  }, [zTop]);

  // ─── Update window geometry ───────────────────────────────────
  const updateWindow = useCallback((id, patch) => {
    setWindows((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }, []);

  // ─── Logout ───────────────────────────────────────────────────
  const handleLogout = async () => {
    await logout();
    setUser(null);
    setWindows({});
    setStartMenuOpen(false);
    setPhase('login');
  };

  const activeWindowIds = Object.entries(windows)
    .filter(([, v]) => !v.minimized)
    .map(([k]) => k);

  return (
    <div className={styles.root}>
      {/* Cursor Trails */}
      {cursorTrailEnabled && <CursorTrail />}

      {/* ── Boot ── */}
      {phase === 'boot' && <BootScreen onDone={handleBootDone} />}

      {/* ── Login ── */}
      {phase === 'login' && (
        <LoginScreen onDone={handleLoginDone} showToast={showToast} />
      )}

      {/* ── Desktop ── */}
      {phase === 'desktop' && (
        <PortfolioProvider>
        <div ref={desktopRef} className={styles.desktop}>
          {/* Wallpaper */}
          <div className={styles.wallpaper} />

          {/* Desktop Icons */}
          <DesktopIcons openWindow={openWindow} user={user} />

          {/* Windows */}
          <WindowManager
            windows={windows}
            windowDefs={WINDOWS}
            user={user}
            openWindow={openWindow}
            closeWindow={closeWindow}
            minimizeWindow={minimizeWindow}
            focusWindow={focusWindow}
            updateWindow={updateWindow}
            showToast={showToast}
          />

          {/* Start Menu */}
          {startMenuOpen && (
            <StartMenu
              user={user}
              openWindow={openWindow}
              onClose={() => setStartMenuOpen(false)}
              onLogout={handleLogout}
            />
          )}

          {/* Taskbar */}
          <Taskbar
            windows={windows}
            windowDefs={WINDOWS}
            startMenuOpen={startMenuOpen}
            onStartClick={() => setStartMenuOpen((p) => !p)}
            onTaskClick={(id) => {
              if (windows[id]?.minimized) {
                focusWindow(id);
              } else if (activeWindowIds[activeWindowIds.length - 1] === id) {
                minimizeWindow(id);
              } else {
                focusWindow(id);
              }
            }}
            cursorTrailEnabled={cursorTrailEnabled}
            onToggleCursorTrail={toggleCursorTrail}
          />

          {/* Toast */}
          <XPToast toast={toast} />
        </div>
        </PortfolioProvider>
      )}
    </div>
  );
}
