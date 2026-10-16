import BlogFeed from './BlogFeed';

export default function BlogHome() {
  return (
    <div className="blog-page">
      <section className="blog-hero" aria-labelledby="blog-title">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> FIELD NOTES / 01—∞</p>
          <h1 id="blog-title">Ideas become<br /><span>things worth sharing.</span></h1>
          <p className="hero-description">
            Notes on software, problem-solving, and what I learn while building useful things.
            Written to be revisited, not just scrolled past.
          </p>
          <a className="hero-link" href="#writing">Explore the notes <span aria-hidden="true">↓</span></a>
        </div>
        <figure className="hero-art">
          <div className="art-orbit art-orbit-outer" aria-hidden="true" />
          <div className="art-orbit art-orbit-inner" aria-hidden="true" />
          <div className="hero-core" aria-hidden="true"><span>✳</span></div>
          <figcaption className="art-caption">JOURNAL<br />RESEARCH / NOTES</figcaption>
        </figure>
        <div className="hero-index" aria-hidden="true">01 / JOURNAL</div>
      </section>

      <BlogFeed />
    </div>
  );
}
