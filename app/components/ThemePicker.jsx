'use client';
import React from 'react';
import { useTheme } from './ThemeProvider';
import { Palette } from 'lucide-react';

/**
 * Single-theme badge for the site's fixed Studio design.
 */

export default function ThemePicker() {
  const { mounted } = useTheme();

  if (!mounted) return <div className="theme-toggle-skeleton" />;

  return (
    <div className="theme-badge" aria-label="Theme: Studio">
      <Palette size={13} className="theme-badge-icon" />
      <span className="theme-badge-name">Studio</span>
    </div>
  );
}
