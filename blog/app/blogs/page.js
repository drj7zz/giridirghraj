import BlogHome from '../../components/BlogHome';

export const metadata = {
  title: 'Writing',
  description: 'Practical notes on software, problem-solving, and lessons from things built along the way.',
  ...(process.env.NEXT_PUBLIC_BLOG_URL
    ? { alternates: { canonical: process.env.NEXT_PUBLIC_BLOG_URL.trim().replace(/\/+$/, '') } }
    : {})
};

export default function BlogsPage() {
  return <BlogHome />;
}
