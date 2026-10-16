import './globals.css';
import SiteNav from '../components/SiteNav';

const portfolioUrl = process.env.NEXT_PUBLIC_PORTFOLIO_URL?.trim().replace(/\/+$/, '');
const blogUrl = process.env.NEXT_PUBLIC_BLOG_URL?.trim().replace(/\/+$/, '');

export const metadata = {
  ...(blogUrl ? { metadataBase: new URL(blogUrl) } : {}),
  title: {
    default: 'Writing | DRJ7ZZ',
    template: '%s | DRJ7ZZ Writing'
  },
  description: 'Notes on software, problem-solving, and building useful digital experiences by Dirghraj Giri.',
  keywords: ['Dirghraj Giri', 'DRJ', 'drj7zz', 'software development', 'web development', 'engineering notes'],
  ...(portfolioUrl ? { authors: [{ name: 'Dirghraj Giri', url: portfolioUrl }] } : {}),
  creator: 'Dirghraj Giri',
  publisher: 'DRJ7ZZ',
  ...(blogUrl ? { alternates: { canonical: '/' } } : {}),
  openGraph: {
    title: 'Writing | DRJ7ZZ',
    description: 'Notes on software, problem-solving, and building useful digital experiences.',
    ...(blogUrl ? { url: blogUrl } : {}),
    type: 'website'
  },
  twitter: {
    card: 'summary',
    title: 'Writing | DRJ7ZZ',
    description: 'Notes on software, problem-solving, and building useful digital experiences.'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          <SiteNav />
          <main>{children}</main>
          <footer className="site-footer">
            <span>Independent notes by Dirghraj Giri.</span>
            {portfolioUrl && <a href={portfolioUrl}>Back to portfolio <span aria-hidden="true">↗</span></a>}
          </footer>
        </div>
      </body>
    </html>
  );
}
