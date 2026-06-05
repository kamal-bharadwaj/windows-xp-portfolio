'use client';

import { useEffect, useRef } from 'react';

const TRAIL_LENGTH = 10; // Number of trailing cursors
const SPACING = 2;       // Update spacing (frames between each trail cursor)

export default function CursorTrail() {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const historyRef = useRef([]);

  useEffect(() => {
    // 1. Keep track of current mouse coordinates
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 2. Setup the trail elements list
    const container = containerRef.current;
    if (!container) return;

    // Clear any existing elements (React double-mount safety)
    container.innerHTML = '';

    const elements = [];
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      const el = document.createElement('div');
      el.style.position = 'fixed';
      el.style.top = '0';
      el.style.left = '0';
      el.style.width = '14px';
      el.style.height = '21px';
      el.style.pointerEvents = 'none';
      el.style.zIndex = '999999';
      el.style.display = 'none'; // Hidden initially
      
      // Calculate opacity for classic fade (fade out towards the end of the trail)
      // We skip rendering index 0 (which would overlap directly with the real cursor)
      const opacity = 1 - ((i + 1) / (TRAIL_LENGTH + 1)) * 0.8;
      el.style.opacity = opacity.toString();
      
      // Classic Windows XP cursor SVG with drop shadow
      el.innerHTML = `
        <svg width="14" height="21" viewBox="0 0 14 21" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(1px 1px 1.5px rgba(0,0,0,0.4));">
          <path d="M0 0 V17.5 L4.5 13.5 L8 20.5 L10.5 19.2 L7 12.5 L13 12.5 Z" fill="white" stroke="black" stroke-width="1.25" stroke-linejoin="miter"/>
        </svg>
      `;
      container.appendChild(el);
      elements.push(el);
    }

    // 3. Animation loop using requestAnimationFrame
    let animId;
    const updateTrail = () => {
      const { x, y } = mouseRef.current;
      
      // Append current position to history
      historyRef.current.push({ x, y });

      // Cap the history array size to fit the trail
      const maxHistory = (TRAIL_LENGTH + 1) * SPACING;
      if (historyRef.current.length > maxHistory) {
        historyRef.current.shift();
      }

      const history = historyRef.current;
      
      // Update trail element positions (skipping current position for element 0 to avoid overlapping the real cursor)
      elements.forEach((el, index) => {
        // Read coordinate from history with spacing. We offset by SPACING to trail behind the real cursor.
        const histIndex = Math.max(0, history.length - 1 - ((index + 1) * SPACING));
        const point = history[histIndex];
        
        if (point) {
          el.style.display = 'block';
          // Use translate3d for GPU acceleration
          el.style.transform = `translate3d(${point.x}px, ${point.y}px, 0)`;
        } else {
          el.style.display = 'none';
        }
      });

      animId = requestAnimationFrame(updateTrail);
    };

    animId = requestAnimationFrame(updateTrail);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: 0, 
        height: 0, 
        pointerEvents: 'none', 
        zIndex: 999999 
      }} 
    />
  );
}
