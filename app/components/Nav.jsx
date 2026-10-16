'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BLOG_URL } from '../lib/site-links';

const NAV_ITEMS = [
  { href: '/projects', label: 'Works' },
  { href: '/about', label: 'About' },
  { href: BLOG_URL, label: 'Blog' },
  { href: '/connect', label: 'Connect' }
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="nav" aria-label="Primary navigation">
      <Link className="brand" href="/" aria-label="DRJ home">
        <img
          className="brand-mark"
          src="/assets/images/logo.png"
          alt=""
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        />
        <span>DRJ<span className="brand-period">.</span></span>
      </Link>

      <div className="nav-controls">
        <nav className="nav-links" aria-label="Portfolio sections">
          {NAV_ITEMS.map(({ href, label }) => {
            const isActive = pathname === href
              || (href === '/projects' && pathname === '/work')
              || (href === '/' && pathname === '/dashboard');
            return (
              <Link
                key={href}
                href={href}
                prefetch={true}
                className={`nav-item ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <Link className="nav-cta" href="/resume">Résumé <span aria-hidden="true">↗</span></Link>
      </div>
    </header>
  );
}
