'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Code2,
  FileText,
  Flame,
  GitCommit,
  Github,
  Layers3,
  Mail,
  MapPin,
  RefreshCw,
  Sparkles,
  Trophy
} from 'lucide-react';
import FeaturedWriting from '../components/FeaturedWriting';
import Icon from '../components/Icon';
import { blogPosts as seedBlogs, projects as seedProjects, socialLinks as seedSocialLinks } from '../lib/data';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function DashboardPage() {
  const [activity, setActivity] = useState(null);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [topBlogs, setTopBlogs] = useState(seedBlogs.slice(0, 2));
  const [projects, setProjects] = useState(seedProjects.slice(0, 3));
  const [profile, setProfile] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [socials, setSocials] = useState(seedSocialLinks);
  const [profileImgError, setProfileImgError] = useState(false);
  const imgRef = useRef(null);
  const heroHeadline = profile?.headline || '';
  const heroIntro = profile?.intro || '';

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth === 0) {
      setProfileImgError(true);
    }

    async function loadDashboardData() {
      try {
        const [activityResponse, blogsResponse, projectsResponse, infoResponse, profileResponse] = await Promise.all([
          fetch('/api/github-activity'),
          fetch('/api/blogs'),
          fetch('/api/projects'),
          fetch('/api/site-info'),
          fetch('/api/profile')
        ]);

        if (activityResponse.ok) {
          setActivity(await activityResponse.json());
        }

        if (blogsResponse.ok) {
          const result = await blogsResponse.json();
          if (Array.isArray(result.data)) setTopBlogs(result.data.slice(0, 2));
        }

        if (projectsResponse.ok) {
          const result = await projectsResponse.json();
          if (Array.isArray(result.data)) setProjects(result.data.slice(0, 3));
        }

        if (infoResponse.ok) {
          const result = await infoResponse.json();
          if (Array.isArray(result?.data?.socialLinks) && result.data.socialLinks.length > 0) {
            setSocials(result.data.socialLinks);
          }
        }

        if (profileResponse.ok) {
          const result = await profileResponse.json();
          if (result.data) setProfile(result.data);
        }
      } catch (error) {
        console.error('Unable to load some dashboard content.', error);
      } finally {
        setLoadingActivity(false);
      }
    }

    loadDashboardData();
  }, []);

  const calendar = activity?.contributionCalendar;
  const streak = activity?.contributionStreak || { current: 0, longest: 0, total: 0 };
  const weeks = calendar?.weeks || [];

  const monthPositions = useMemo(() => {
    const months = [];
    let lastMonth = -1;

    weeks.forEach((week, weekIndex) => {
      const firstDay = week.contributionDays?.find((day) => day?.date);
      if (!firstDay) return;

      const month = new Date(firstDay.date).getMonth();
      if (month !== lastMonth) {
        months.push({ name: MONTH_NAMES[month], colIndex: weekIndex });
        lastMonth = month;
      }
    });

    return months;
  }, [weeks]);

  const formatCellDate = (date) => new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="home-page">
      <section className="hero hero-redesign" aria-labelledby="hero-title">
        <div className="hero-copy-wrap">
          <p className="eyebrow hero-kicker"><span className="status-dot" /> Independent developer · Nepal</p>
          <h1 id="hero-title" className="hero-title">
            {heroHeadline}
          </h1>
          <p className="hero-intro">
            {heroIntro}
          </p>
          <div className="cta-row">
            <Link className="button" href="/projects">
              Explore my work <ArrowUpRight size={16} />
            </Link>
            <Link className="button ghost" href="/connect">
              Connect <ArrowRight size={15} />
            </Link>
          </div>
          <div className="hero-social-links" aria-label="Social links">
            {socials.map((link) => (
              <a
                key={`${link.name}-${link.url}`}
                href={link.url}
                target={link.url?.startsWith('mailto:') ? undefined : '_blank'}
                rel={link.url?.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                className="hero-social-badge"
                aria-label={link.name}
                title={link.name}
              >
                <Icon name={link.icon} size={15} />
                <span>{link.name}</span>
              </a>
            ))}
          </div>
        </div>

        <figure className="hero-art" aria-label="Portrait of Dirghraj Giri">
          <div className="hero-art-grid" aria-hidden="true" />
          <div className="hero-art-orbit hero-art-orbit--outer" aria-hidden="true" />
          <div className="hero-art-orbit hero-art-orbit--inner" aria-hidden="true" />
          <div className="hero-art-image">
            {profileImgError ? (
              <div className="hero-art-fallback" role="img" aria-label="Dirghraj Giri">
                DRJ
              </div>
            ) : (
              <img
                ref={imgRef}
                src="/assets/images/profile-cutout.png"
                alt="Dirghraj Giri"
                width={486}
                height={780}
                onError={() => setProfileImgError(true)}
              />
            )}
          </div>
          <div className="hero-art-caption">
            <span className="hero-art-caption-icon"><Code2 size={16} /></span>
            <span><strong>Software developer</strong><br />building useful things</span>
          </div>
          <div className="hero-art-location"><MapPin size={13} /> Madhesh, Nepal</div>
          <span className="hero-art-sparkle hero-art-sparkle--one" aria-hidden="true">✳</span>
          <span className="hero-art-sparkle hero-art-sparkle--two" aria-hidden="true">✦</span>
        </figure>

        <a className="hero-scroll" href="#selected-work">
          <span>Scroll to explore</span><ArrowDownRight size={15} />
        </a>
      </section>

      <section className="home-section projects-section home-projects" id="selected-work" aria-labelledby="projects-title">
        <div className="section-heading">
          <div>
            <h2 id="projects-title">Selected work<span className="heading-period">.</span></h2>
          </div>
          <Link className="view-all-link" href="/projects">
            All works <ArrowUpRight size={15} />
          </Link>
        </div>

        <div className="home-project-grid">
          {projects.map((project, index) => (
            <article className="home-project-card" data-tone={index % 3} key={project.id || project.name}>
              <div className="home-project-card-top">
                <span className="home-project-number">0{index + 1}</span>
                <span className="home-project-mark" aria-hidden="true">
                  {index === 0 ? <Layers3 size={20} /> : index === 1 ? <Code2 size={20} /> : <Sparkles size={20} />}
                </span>
              </div>
              <div className="home-project-card-copy">
                <p className="home-project-stack">{Array.isArray(project.stack) ? project.stack.join(' · ') : project.stack || 'Web project'}</p>
                <h3>{project.name}</h3>
                <p className="home-project-description">{project.description}</p>
              </div>
              <div className="home-project-links">
                {project.live && (
                  <a href={project.live} target="_blank" rel="noopener noreferrer">
                    Live project <ArrowUpRight size={14} />
                  </a>
                )}
                {project.code && (
                  <a href={project.code} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.name} source code`}>
                    <Github size={15} /> Source
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-founder" aria-label="KAALYUG">
        <span className="home-founder-mark"><Layers3 size={20} /></span>
        <div className="home-founder-copy">
          <strong>Founder of KAALYUG</strong>
          <p>{profile?.kaalyugNote || 'Building practical open-source software and tools for the web.'}</p>
        </div>
        <a href="https://kaalyug.vercel.app" target="_blank" rel="noopener noreferrer">
          Visit KAALYUG <ArrowUpRight size={15} />
        </a>
      </section>

      <FeaturedWriting posts={topBlogs} />

      <section className="home-section github-panel home-activity" aria-labelledby="dashboard-github-title">
        <div className="section-heading github-heading">
          <div>
            <h2 id="dashboard-github-title">Building in public<span className="heading-period">.</span></h2>
            <p className="github-intro">A snapshot of my recent work and open-source contributions.</p>
          </div>
          <Link className="view-all-link" href="/work">
            GitHub activity <ArrowUpRight size={15} />
          </Link>
        </div>

        <div className="streak-stats">
          <div className="streak-stat-item">
            <div className="streak-stat-header"><GitCommit size={15} /><span>Contributions</span></div>
            <strong>{streak.total || 0}</strong>
          </div>
          <div className="streak-stat-item">
            <div className="streak-stat-header"><Flame size={15} /><span>Current streak</span></div>
            <strong>{streak.current || 0}<em className="streak-unit"> days</em></strong>
          </div>
          <div className="streak-stat-item">
            <div className="streak-stat-header"><Trophy size={15} /><span>Longest streak</span></div>
            <strong>{streak.longest || 0}<em className="streak-unit"> days</em></strong>
          </div>
        </div>

        {weeks.length > 0 ? (
          <div className="graph-container">
            <div className="graph-tooltip-banner" aria-live="polite">
              {hoveredCell ? (
                <>
                  <span className="tooltip-count"><strong>{hoveredCell.count}</strong> {hoveredCell.count === 1 ? 'contribution' : 'contributions'}</span>
                  <span className="tooltip-date">on {formatCellDate(hoveredCell.date)}</span>
                </>
              ) : (
                <span className="tooltip-placeholder">Explore the last year of activity</span>
              )}
            </div>

            <div className="graph-scroll-area">
              <div className="graph-table-layout">
                <div className="graph-months-row" aria-hidden="true">
                  <div className="graph-days-spacer" />
                  <div className="graph-months-track">
                    {monthPositions.map((month, index) => (
                      <span
                        className="graph-month-label"
                        key={`${month.name}-${index}`}
                        style={{ gridColumnStart: month.colIndex + 1 }}
                      >
                        {month.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="graph-body-row">
                  <div className="graph-days-label" aria-hidden="true">
                    <span>Mon</span><span>Wed</span><span>Fri</span>
                  </div>
                  <div className="graph-grid" role="grid" aria-label="GitHub contributions over the past year">
                    {weeks.map((week, weekIndex) => (
                      <div className="graph-column" key={weekIndex} role="row">
                        {(week.contributionDays || []).map((day) => {
                          const count = day.contributionCount || 0;
                          const level = count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 9 ? 3 : 4;
                          const isHovered = hoveredCell?.date === day.date;
                          return (
                            <button
                              type="button"
                              key={day.date}
                              className={`graph-cell level-${level} ${isHovered ? 'is-active' : ''}`}
                              aria-label={`${count} contributions on ${day.date}`}
                              onMouseEnter={() => setHoveredCell({ date: day.date, count })}
                              onMouseLeave={() => setHoveredCell(null)}
                              onFocus={() => setHoveredCell({ date: day.date, count })}
                              onBlur={() => setHoveredCell(null)}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="graph-footer">
              <span className="graph-scroll-hint">One square, one day</span>
              <div className="graph-legend" aria-label="Contribution intensity">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((level) => <span key={level} className={`graph-cell level-${level}`} aria-hidden="true" />)}
                <span>More</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="activity-empty" aria-live="polite">
            {loadingActivity ? (
              <><RefreshCw size={15} className="spin-icon" /> Loading recent activity…</>
            ) : (
              <>GitHub activity is taking a short break. Visit my profile for the latest.</>
            )}
          </div>
        )}
        <a className="activity-profile-link" href="https://github.com/drj7zz" target="_blank" rel="noopener noreferrer">
          <Github size={15} /> Follow along on GitHub <ArrowUpRight size={14} />
        </a>
      </section>

      <section className="home-contact">
        <div className="home-contact-copy">
          <h2>Let’s make it<br /><span>matter.</span></h2>
        </div>
        <Link href="/connect" className="home-contact-link">
          <span>Connect</span><Mail size={18} />
        </Link>
        <Link href="/resume" className="home-resume-link"><FileText size={17} /> View résumé</Link>
      </section>
    </div>
  );
}
