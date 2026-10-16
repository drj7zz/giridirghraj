'use client';

import { usePathname } from 'next/navigation';

const portfolioUrl = process.env.NEXT_PUBLIC_PORTFOLIO_URL?.trim().replace(/\/+$/, '');

function portfolioHref(path) {
  return portfolioUrl ? `${portfolioUrl}${path}` : path;
}

export default function SiteNav() {
  const pathname = usePathname();
  const isOnBlog = pathname === '/blogs';

  return (
    <header className="site-header">
      <a className="wordmark" href={portfolioHref('/')} aria-label="DRJ portfolio home">
        <img
          className="wordmark-mark"
          src={portfolioUrl ? `${portfolioUrl}/assets/images/logo.png` : '/assets/images/logo.png'}
          alt=""
          width="31"
          height="31"
        />
        <span>DRJ<span className="wordmark-accent">.</span></span>
      </a>
      <nav className="header-links" aria-label="Main navigation">
        <a href="/blogs#writing">Journal</a>
        <a href="/blogs?category=research#writing">Research</a>
        <a href="/blogs#writing" aria-current={isOnBlog ? 'page' : undefined}>Blogs</a>
        <a className="header-main" href={portfolioHref('/')}>Main site <span aria-hidden="true">↗</span></a>
      </nav>
    </header>
  );
}
