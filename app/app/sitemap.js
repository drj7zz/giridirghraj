export default function sitemap() {
  const baseUrl = 'https://giridirghraj.vercel.app';
  const configuredBlogUrl = process.env.NEXT_PUBLIC_BLOG_URL?.trim().replace(/\/+$/, '');
  const routes = ['', '/about', '/work', '/connect', '/resume'];
  if (!configuredBlogUrl) routes.push('/blogs');

  const entries = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.8
  }));

  if (configuredBlogUrl) {
    entries.push({
      url: configuredBlogUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    });
  }

  return entries;
}
