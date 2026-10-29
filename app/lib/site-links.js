export const BLOG_URL = '/blogs';

export function getBlogPostUrl(id) {
  return `${BLOG_URL}#${encodeURIComponent(id)}`;
}
