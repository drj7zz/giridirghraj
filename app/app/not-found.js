'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, Compass, GitBranch, Mail } from 'lucide-react';
import { BLOG_URL } from '../lib/site-links';

export default function NotFound() {
  return (
    <section className="section-panel" style={{ maxWidth: '640px', margin: '40px auto', textAlign: 'center', padding: '48px 24px' }}>
      <p style={{ font: '700 12px "DM Mono", monospace', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
        404 / Route Not Located
      </p>
      <h1 style={{ font: '800 clamp(32px, 5vw, 48px) / 1.1 Sora, sans-serif', color: 'var(--ink)', margin: '0 0 16px', letterSpacing: '-0.03em' }}>
        Page does not exist.
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: '14.5px', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto 32px' }}>
        The link you followed may have been relocated, removed, or typed incorrectly. Explore the verified routes below.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '36px' }}>
        <Link className="button" href="/">
          <Home size={14} /> Back to Overview
        </Link>
        <Link className="button ghost" href="/work">
          <GitBranch size={14} /> View Work
        </Link>
        <Link className="button ghost" href="/connect">
          <Mail size={14} /> Contact DRJ
        </Link>
      </div>

      <div style={{ borderTop: '1px solid var(--line)', paddingTop: '24px', display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '11.5px', color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>
        <Link href="/about" style={{ color: 'inherit' }}>About</Link>
        <span>·</span>
        <Link href="/work" style={{ color: 'inherit' }}>Work</Link>
        <span>·</span>
        <Link href={BLOG_URL} style={{ color: 'inherit' }}>Notes</Link>
        <span>·</span>
        <Link href="/connect" style={{ color: 'inherit' }}>Connect</Link>
      </div>
    </section>
  );
}
