import BlogFeed from './BlogFeed';

export default function BlogHome() {
  return (
    <div className="writing-blog-page">
      <section className="writing-blog-hero" aria-labelledby="blog-title">
        <div className="writing-hero-copy">
          <p className="writing-eyebrow"><span className="writing-eyebrow-line" /> FIELD NOTES / 01—∞</p>
          <h1 id="blog-title">Ideas become<br /><span>things worth sharing.</span></h1>
          <p className="writing-hero-description">
            Notes on software, problem-solving, and what I learn while building useful things.
            Written to be revisited, not just scrolled past.
          </p>
          <a className="writing-hero-link" href="#writing">Explore the notes <span aria-hidden="true">↓</span></a>
        </div>
        <figure className="writing-hero-art">
          <div className="writing-art-orbit writing-art-orbit-outer" aria-hidden="true" />
          <div className="writing-art-orbit writing-art-orbit-inner" aria-hidden="true" />
          <div className="writing-hero-core" aria-hidden="true"><span>✳</span></div>
          <figcaption className="writing-art-caption">JOURNAL<br />RESEARCH / NOTES</figcaption>
        </figure>
        <div className="writing-hero-index" aria-hidden="true">01 / JOURNAL</div>
      </section>

      <BlogFeed />
    </div>
  );
}
