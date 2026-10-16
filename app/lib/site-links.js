const configuredBlogUrl = process.env.NEXT_PUBLIC_BLOG_URL?.trim().replace(/\/+$/, '');

export const BLOG_URL = configuredBlogUrl || '/blogs';

export function getBlogPostUrl(id) {
  return `${BLOG_URL}#${encodeURIComponent(id)}`;
}
