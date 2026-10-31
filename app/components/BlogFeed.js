'use client';

import { useEffect, useMemo, useState } from 'react';
import { Bookmark, Share2 } from 'lucide-react';
import { getBlogPostUrl } from '../lib/site-links';

function tagsFor(post) {
  if (Array.isArray(post.tags)) return post.tags.filter(Boolean);
  if (typeof post.tags === 'string') return post.tags.split(',').map((tag) => tag.trim()).filter(Boolean);
  return [];
}

function InlineMarkdown({ text }) {
  return String(text).split(/(\*\*[^*]+\*\*|`[^`\n]+`)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index}>{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

function MarkdownContent({ post }) {
  const blocks = String(post.content || '').split(/(```[\s\S]*?```)/g);

  return (
    <div className="writing-article-content">
      {blocks.map((block, blockIndex) => {
        if (block.startsWith('```')) {
          const match = block.match(/^```([^\r\n`]*)\r?\n([\s\S]*?)```$/);
          if (!match) return <p key={blockIndex}>{block}</p>;
          return (
            <div className="writing-code-example" key={blockIndex}>
              <div className="writing-code-label">{match[1].trim() || 'code'}</div>
              <pre><code>{match[2].replace(/\r?\n$/, '')}</code></pre>
            </div>
          );
        }

        return block.split(/\n\s*\n/).map((paragraph, paragraphIndex) => {
          const trimmed = paragraph.trim();
          if (!trimmed) return null;
          const key = `${blockIndex}-${paragraphIndex}`;
          const heading = trimmed.match(/^#{1,3}\s+(.+)$/);
          const lines = trimmed.split(/\r?\n/);

          if (heading) return <h3 key={key}><InlineMarkdown text={heading[1]} /></h3>;
          if (lines.length > 1 && lines.every((line) => /^[-*]\s+/.test(line.trim()))) {
            return (
              <ul key={key}>
                {lines.map((line, index) => (
                  <li key={index}><InlineMarkdown text={line.trim().replace(/^[-*]\s+/, '')} /></li>
                ))}
              </ul>
            );
          }

          return <p key={key}><InlineMarkdown text={trimmed} /></p>;
        });
      })}
    </div>
  );
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || 'Undated';
  return new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
}

export default function BlogFeed() {
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [category, setCategory] = useState('');
  const [expandedId, setExpandedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savedIds, setSavedIds] = useState(() => new Set());
  const [savingIds, setSavingIds] = useState(() => new Set());
  const [actionMessages, setActionMessages] = useState({});

  useEffect(() => {
    const requestedCategory = new URLSearchParams(window.location.search).get('category');
    setCategory(requestedCategory?.toLowerCase() === 'research' ? 'research' : '');
  }, []);

  useEffect(() => {
    let isCurrent = true;

    async function loadPosts() {
      try {
        const response = await fetch('/api/blogs', { cache: 'no-store' });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Unable to load writing right now.');
        if (!Array.isArray(result.data)) throw new Error('The blog service returned an invalid response.');
        if (isCurrent) setPosts(result.data);
      } catch (loadError) {
        console.error('Unable to load blog posts.', loadError);
        if (isCurrent) setError(loadError.message || 'Unable to load writing right now.');
      } finally {
        if (isCurrent) setLoading(false);
      }
    }

    loadPosts();
    return () => { isCurrent = false; };
  }, []);

  useEffect(() => {
    let isCurrent = true;

    async function loadSavedPosts() {
      try {
        const response = await fetch('/api/user/saved');
        if (response.status === 401) return;
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Unable to load saved notes.');
        if (isCurrent && Array.isArray(result.items)) {
          setSavedIds(new Set(result.items.map((item) => item.id)));
        }
      } catch (loadError) {
        console.error('Unable to load saved writing.', loadError);
      }
    }

    loadSavedPosts();
    return () => { isCurrent = false; };
  }, []);

  useEffect(() => {
    let id;
    try {
      id = decodeURIComponent(window.location.hash.slice(1));
    } catch {
      return;
    }
    if (!id || !posts.some((post) => post.id === id)) return;
    setExpandedId(id);
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }));
  }, [posts]);

  const tags = useMemo(() => {
    const allTags = new Set(['All']);
    posts.forEach((post) => tagsFor(post).forEach((tag) => allTags.add(tag)));
    return Array.from(allTags);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return posts.filter((post) => {
      const postTags = tagsFor(post);
      const searchable = [post.title, post.excerpt, ...postTags].join(' ').toLowerCase();
      return (!normalizedQuery || searchable.includes(normalizedQuery))
        && (!category || postTags.some((tag) => tag.toLowerCase() === category))
        && (selectedTag === 'All' || postTags.includes(selectedTag));
    });
  }, [posts, query, selectedTag, category]);

  async function toggleSaved(post) {
    if (savingIds.has(post.id)) return;
    setSavingIds((current) => new Set(current).add(post.id));
    setActionMessages((current) => ({ ...current, [post.id]: '' }));

    try {
      const isSaved = savedIds.has(post.id);
      const response = await fetch(
        isSaved ? `/api/user/saved?id=${encodeURIComponent(post.id)}` : '/api/user/saved',
        isSaved
          ? { method: 'DELETE' }
          : {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: post.id,
                type: 'blog',
                title: post.title,
                url: getBlogPostUrl(post.id)
              })
            }
      );

      if (response.status === 401) {
        window.location.assign('/login');
        return;
      }

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to update saved notes.');

      setSavedIds((current) => {
        const next = new Set(current);
        if (isSaved) next.delete(post.id);
        else next.add(post.id);
        return next;
      });
      setActionMessages((current) => ({
        ...current,
        [post.id]: isSaved ? 'Removed from saved notes.' : 'Saved to your notes.'
      }));
    } catch (saveError) {
      console.error('Unable to update saved writing.', saveError);
      setActionMessages((current) => ({
        ...current,
        [post.id]: saveError.message || 'Unable to update saved notes.'
      }));
    } finally {
      setSavingIds((current) => {
        const next = new Set(current);
        next.delete(post.id);
        return next;
      });
    }
  }

  async function sharePost(post) {
    const url = new URL(getBlogPostUrl(post.id), window.location.origin).toString();
    setActionMessages((current) => ({ ...current, [post.id]: '' }));

    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, text: post.excerpt || post.title, url });
        setActionMessages((current) => ({ ...current, [post.id]: 'Link shared.' }));
        return;
      }

      if (!navigator.clipboard?.writeText) {
        throw new Error('Sharing is not supported by this browser.');
      }
      await navigator.clipboard.writeText(url);
      setActionMessages((current) => ({ ...current, [post.id]: 'Link copied to clipboard.' }));
    } catch (shareError) {
      if (shareError.name === 'AbortError') return;
      console.error('Unable to share writing.', shareError);
      setActionMessages((current) => ({
        ...current,
        [post.id]: shareError.message || 'Unable to share this note.'
      }));
    }
  }

  return (
    <section className="writing-writing-section" id="writing" aria-labelledby="writing-title">
      <div className="writing-section-heading">
        <div>
          <p className="writing-eyebrow">THE JOURNAL</p>
          <h2 id="writing-title">{category === 'research' ? 'Research' : 'Writing'} <span>archive</span></h2>
        </div>
        <p className="writing-section-note">{posts.length} {posts.length === 1 ? 'note' : 'notes'} · updated as I learn</p>
      </div>

      <div className="writing-filter-panel">
        <label className="writing-search-box">
          <span aria-hidden="true">⌕</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="search"
            placeholder="Search by topic, idea, or keyword"
            aria-label="Search writing"
          />
        </label>
        <div className="writing-tag-list" aria-label="Filter by topic">
          {tags.map((tag) => (
            <button
              type="button"
              key={tag}
              className={`writing-tag-filter${selectedTag === tag ? ' writing-is-active' : ''}`}
              aria-pressed={selectedTag === tag}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="writing-feed-message" role="status">Loading the latest writing…</p>}
      {!loading && error && <p className="writing-feed-message writing-feed-error" role="alert">{error}</p>}
      {!loading && !error && filteredPosts.length === 0 && (
        <p className="writing-feed-message">
          {category === 'research'
            ? 'No research notes have been published yet.'
            : posts.length ? 'No notes match those filters.' : 'No writing has been published yet.'}
        </p>
      )}

      <div className="writing-article-list">
        {filteredPosts.map((post, index) => {
          const isExpanded = expandedId === post.id;
          return (
            <article className={`writing-article-card${isExpanded ? ' writing-is-expanded' : ''}`} id={post.id} key={post.id}>
              <span className="writing-article-number">{String(index + 1).padStart(2, '0')}</span>
              <div className="writing-article-main">
                <div className="writing-article-meta">
                  <time dateTime={post.date || undefined}>{formatDate(post.date)}</time>
                  {post.readTime && <span>{post.readTime}</span>}
                </div>
                <div className="writing-article-actions">
                  <button
                    type="button"
                    className={`writing-article-action${savedIds.has(post.id) ? ' writing-is-saved' : ''}`}
                    aria-label={savedIds.has(post.id) ? `Remove ${post.title} from saved notes` : `Save ${post.title}`}
                    aria-pressed={savedIds.has(post.id)}
                    disabled={savingIds.has(post.id)}
                    onClick={() => toggleSaved(post)}
                  >
                    <Bookmark size={14} fill={savedIds.has(post.id) ? 'currentColor' : 'none'} />
                    {savingIds.has(post.id) ? 'Saving…' : savedIds.has(post.id) ? 'Saved' : 'Save'}
                  </button>
                  <button
                    type="button"
                    className="writing-article-action"
                    aria-label={`Share ${post.title}`}
                    onClick={() => sharePost(post)}
                  >
                    <Share2 size={14} />
                    Share
                  </button>
                  {actionMessages[post.id] && (
                    <span className="writing-article-action-message" role="status">
                      {actionMessages[post.id]}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  className="writing-article-title-button"
                  aria-expanded={isExpanded}
                  onClick={() => setExpandedId(isExpanded ? '' : post.id)}
                >
                  <h3>{post.title}</h3>
                  <span className="writing-article-toggle" aria-hidden="true">{isExpanded ? '−' : '+'}</span>
                </button>
                {post.excerpt && <p className="writing-article-excerpt">{post.excerpt}</p>}
                <div className="writing-article-tags">
                  {tagsFor(post).map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                {isExpanded && <MarkdownContent post={post} />}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
