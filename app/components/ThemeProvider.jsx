'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * Single-theme provider.
 * The site ships one design language only: "studio" — deep ink, bright
 * citron, and editorial typography. Kept as a context so components can read `theme`
 * without code churn. `setTheme`/`cycleTheme` are no-ops.
 */

const THEME = 'studio';

const ThemeContext = createContext({
  theme: THEME,
  themes: [THEME],
  setTheme: () => { },
  cycleTheme: () => { },
  mounted: false
});

export function ThemeProvider({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', THEME);
    try {
      localStorage.setItem('drj-theme', THEME);
    } catch (e) {
      /* storage unavailable — non-fatal */
    }
    setMounted(true);

    // Global protection against image copying, context menu, and drag transfer
    const handleContextMenu = (e) => {
      if (e.target && e.target.tagName === 'IMG') {
        e.preventDefault();
      }
    };

    const handleDragStart = (e) => {
      if (e.target && e.target.tagName === 'IMG') {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  const setTheme = () => { };
  const cycleTheme = () => { };

  return (
    <ThemeContext.Provider value={{ theme: THEME, themes: [THEME], setTheme, cycleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
