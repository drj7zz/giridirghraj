import './globals.css';
import { ThemeProvider } from '../components/ThemeProvider';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

export const metadata = {
  metadataBase: new URL('https://giridirghraj.vercel.app'),
  title: {
    default: 'Dirghraj Giri | Software Developer',
    template: '%s | Dirghraj Giri'
  },
  description: 'Dirghraj Giri, also known as DRJ and drj7zz, is a software developer from Nepal building practical, accessible, and maintainable digital products.',
  keywords: ['Dirghraj Giri', 'DRJ', 'drj7zz', 'software developer Nepal', 'JavaScript developer', 'Next.js developer', 'web developer', 'portfolio', 'open-source developer', 'accessible software'],
  authors: [{ name: 'Dirghraj Giri', url: 'https://github.com/drj7zz' }],
  creator: 'Dirghraj Giri',
  publisher: 'DRJ7ZZ',
  openGraph: {
    title: 'Dirghraj Giri | Software Developer',
    description: 'Portfolio of Dirghraj Giri, a software developer from Nepal building practical digital products.',
    url: '/',
    siteName: 'DRJ7ZZ Portfolio',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/assets/images/profile-cutout.png', width: 486, height: 780, alt: 'Dirghraj Giri, also known as DRJ7ZZ' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dirghraj Giri | Software Developer',
    description: 'Portfolio of Dirghraj Giri, a software developer from Nepal building practical digital products.',
    images: ['/assets/images/profile-cutout.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 }
  },
  icons: {
    icon: '/assets/images/logo.png',
    apple: '/assets/images/logo.png'
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0b0d10' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0d10' }
  ]
};

export default function RootLayout({ children }) {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'DRJ7ZZ Portfolio',
    url: 'https://giridirghraj.vercel.app',
    description: 'Official portfolio of Dirghraj Giri, also known as DRJ and drj7zz, a software developer from Nepal.',
    author: {
      '@type': 'Person',
      name: 'Dirghraj Giri',
      url: 'https://giridirghraj.vercel.app'
    }
  };

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Dirghraj Giri',
    alternateName: ['DRJ7ZZ', 'DRJ', 'drj7zz', 'Dirghraj', 'Giridirghraj'],
    url: 'https://giridirghraj.vercel.app',
    image: 'https://giridirghraj.vercel.app/assets/images/profile-cutout.png',
    jobTitle: 'Software Developer',
    description: 'Software developer from Nepal building practical, accessible, and maintainable digital products.',
    address: { '@type': 'PostalAddress', addressCountry: 'NP', addressLocality: 'Parsa, Madhesh' },
    sameAs: [
      'https://github.com/drj7zz',
      'https://www.linkedin.com/in/dirghraj-giri',
      'https://www.instagram.com/drj1zz',
      'https://x.com/drj7zz',
      'https://www.reddit.com/user/Ok-Fox-4670'
    ],
    knowsAbout: ['Software Development', 'JavaScript', 'TypeScript', 'Next.js', 'React', 'Web Accessibility (WCAG)', 'Git', 'Open Source']
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700;12..96,800&family=DM+Mono:wght@400;500&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
        <ThemeProvider>
          <div className="page-shell">
            <Nav />
            <main id="main-content">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
