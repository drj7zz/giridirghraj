import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Blog',
  description: 'Notes on software, problem-solving, and useful things built along the way.'
};

export default function BlogsRoute() {
  const blogUrl = process.env.NEXT_PUBLIC_BLOG_URL?.trim().replace(/\/+$/, '');
  // The writing app is deployed independently. When its origin is configured we
  // redirect there; otherwise fall back to the portfolio's own /blog route.
  redirect(blogUrl || '/blog');
}
