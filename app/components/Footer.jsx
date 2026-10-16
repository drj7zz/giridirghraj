import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <Link href="/" className="footer-brand">DRJ<span className="brand-period">.</span></Link>
      <p>Designed &amp; built by Dirghraj Giri · © {currentYear}</p>
      <a href="https://github.com/drj7zz" target="_blank" rel="noopener noreferrer">
        GitHub <span aria-hidden="true">↗</span>
      </a>
    </footer>
  );
}
