'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BLOG_URL, getBlogPostUrl } from '../lib/site-links';

/**
 * FeaturedWriting
 * ----------------
 * The "Engineering Notes" teaser that used to live inline inside
 * app/page.js. Extracted into its own component so the blog section stays
 * separate from the main dashboard file, while still being rendered on the
 * dashboard. The "All Notes" CTA links to the separately deployed Blog site.
 */

export default function FeaturedWriting({ posts = [] }) {
  return (
    <section className="blog-section" aria-labelledby="dashboard-blog-title">
      <div className="dashboard-heading">
        <div>
          <h2 id="dashboard-blog-title">Featured Writing</h2>
        </div>
        <Link className="view-all-link" href={BLOG_URL}>
          All Notes <ArrowRight size={14} />
        </Link>
      </div>

      {posts.length === 0 && (
        <p style={{ color: 'var(--muted)', fontSize: '13px' }}>
          No featured notes published yet.{' '}
          <Link className="text-link" href={BLOG_URL} style={{ margin: 0 }}>
            Visit the blog →
          </Link>
        </p>
      )}

      <div className="blog-list">
        {posts.map((post) => (
          <article className="blog-card" key={post.id}>
            <Link href={getBlogPostUrl(post.id)} className="blog-card-header" style={{ textDecoration: 'none', display: 'block' }}>
              <div className="blog-card-meta">
                <span>{post.date}</span>
                <span className="blog-read-time">{post.readTime}</span>
              </div>
              <h3>{post.title}</h3>
              <p className="blog-excerpt">{post.excerpt}</p>
              <div className="blog-card-footer">
                <div className="blog-tags">
                  {Array.isArray(post.tags) ? post.tags.map((tag) => (
                    <span className="blog-tag" key={tag}>{tag}</span>
                  )) : (
                    <span className="blog-tag">{post.tags}</span>
                  )}
                </div>
                <span className="blog-toggle">
                  Read note <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
