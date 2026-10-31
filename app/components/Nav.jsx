'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, User, BookOpen, Mail, FileText, ArrowUpRight } from 'lucide-react';
import { BLOG_URL } from '../lib/site-links';

const NAV_ITEMS = [
  { href: '/projects', label: 'Works', Icon: Briefcase },
  { href: '/about', label: 'About', Icon: User },
  { href: BLOG_URL, label: 'Blog', Icon: BookOpen },
  { href: '/connect', label: 'Connect', Icon: Mail },
  { href: '/resume', label: 'Résumé', Icon: FileText, mobileOnly: true }
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
          {NAV_ITEMS.map(({ href, label, Icon, mobileOnly }) => {
            const isActive = pathname === href
              || (href === '/projects' && pathname === '/work')
              || (href === '/' && pathname === '/dashboard');
            return (
              <Link
                key={href}
                href={href}
                prefetch={true}
                className={`nav-item ${isActive ? 'active' : ''} ${mobileOnly ? 'mobile-nav-only' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="nav-item-icon" size={18} strokeWidth={1.8} aria-hidden="true" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
        <Link className="nav-cta" href="/resume">Résumé <ArrowUpRight size={15} aria-hidden="true" /></Link>
      </div>
    </header>
  );
}
