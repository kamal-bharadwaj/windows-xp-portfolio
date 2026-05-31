'use client';
import { useRef, useCallback } from 'react';
import styles from './WindowManager.module.css';
import XPWindow from './XPWindow';
import AboutWindow from './windows/AboutWindow';
import ProjectsWindow from './windows/ProjectsWindow';
import SkillsWindow from './windows/SkillsWindow';
import ContactWindow from './windows/ContactWindow';
import SearchWindow from './windows/SearchWindow';
import AdminWindow from './windows/AdminWindow';

const CONTENT_MAP = {
  about:    AboutWindow,
  projects: ProjectsWindow,
  skills:   SkillsWindow,
  contact:  ContactWindow,
  search:   SearchWindow,
  admin:    AdminWindow,
};

export default function WindowManager({
  windows, windowDefs, user,
  openWindow, closeWindow, minimizeWindow, focusWindow, updateWindow, showToast,
}) {
  return (
    <div className={styles.layer}>
      {Object.entries(windows).map(([id, state]) => {
        const def = windowDefs[id];
        const Content = CONTENT_MAP[id];
        if (!def || !Content) return null;
        return (
          <XPWindow
            key={id}
            id={id}
            title={def.title}
            icon={def.icon}
            state={state}
            onClose={() => closeWindow(id)}
            onMinimize={() => minimizeWindow(id)}
            onFocus={() => focusWindow(id)}
            onMove={(x, y) => updateWindow(id, { x, y })}
          >
            <Content user={user} openWindow={openWindow} showToast={showToast} />
          </XPWindow>
        );
      })}
    </div>
  );
}
