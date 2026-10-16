import { redirect } from 'next/navigation';
import LegacyBlogPage from '../blog/LegacyBlogPage';

export const metadata = {
  title: 'Blog',
  description: 'Notes on software, problem-solving, and useful things built along the way.'
};

export default function BlogsRoute() {
  const blogUrl = process.env.NEXT_PUBLIC_BLOG_URL?.trim().replace(/\/+$/, '');
  if (blogUrl) redirect(blogUrl);
  return <LegacyBlogPage />;
}
