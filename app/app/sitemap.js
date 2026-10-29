export default function sitemap() {
  const baseUrl = 'https://giridirghraj.vercel.app';
  const routes = ['', '/about', '/work', '/connect', '/resume', '/blogs'];

  const entries = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.8
  }));

  return entries;
}
