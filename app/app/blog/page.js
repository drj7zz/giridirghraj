import { redirect } from 'next/navigation';

export default function BlogRoute() {
  const blogUrl = process.env.NEXT_PUBLIC_BLOG_URL?.trim().replace(/\/+$/, '');
  redirect(blogUrl || '/blogs');
}
