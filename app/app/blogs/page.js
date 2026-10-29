import BlogHome from '../../components/BlogHome';
import './blog.css';

export const metadata = {
  title: 'Writing',
  description: 'Notes on software, problem-solving, and useful things built along the way.',
  openGraph: {
    title: 'Writing | Dirghraj Giri',
    description: 'Notes on software, problem-solving, and useful things built along the way.'
  }
};

export default function BlogsRoute() {
  return (
    <div id="writing-page">
      <BlogHome />
    </div>
  );
}
