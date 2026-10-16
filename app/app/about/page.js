'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Code2, Layout, GitBranch, ArrowRight, MapPin, GraduationCap, Compass, Gauge, Send } from 'lucide-react';

const FACT_ICONS = { Location: MapPin, Education: GraduationCap, Discipline: Compass, Approach: Gauge };
const SKILL_ICONS = { Code2, Layout, GitBranch };

const Skeleton = () => (
  <div className="about-page" aria-busy="true">
    <div className="skeleton-block" style={{ height: 220 }} />
    <div className="skeleton-block" style={{ height: 120 }} />
    <div className="skeleton-block" style={{ height: 260 }} />
  </div>
);

export default function AboutPage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/profile')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Failed to load'))))
      .then((d) => setProfile(d.data))
      .catch(() => setError('Could not load profile. Refresh to retry.'));
  }, []);

  if (error) {
    return (
      <div className="about-page">
        <div className="about-error" role="alert">{error}</div>
      </div>
    );
  }
  if (!profile) return <Skeleton />;

  return (
    <div className="about-page">
      {/* ── Who I am ── */}
      <section className="about-hero" aria-labelledby="about-title">
        <h2 id="about-title">{profile.headline}</h2>
        <p className="about-lede">{profile.intro}</p>
        {profile.kaalyugNote && <p className="kaalyug-note">{profile.kaalyugNote}</p>}
      </section>

      {/* ── Quick facts as floating chips (not a table) ── */}
      <section className="about-facts" aria-label="Quick facts">
        {(profile.facts || []).map(([label, lines]) => {
          const Icon = FACT_ICONS[label] || Compass;
          return (
            <div className="about-fact-card" key={label}>
              <span className="about-fact-icon"><Icon size={15} /></span>
              <div>
                <span className="about-fact-label">{label}</span>
                <strong>{lines.join(' ')}</strong>
              </div>
            </div>
          );
        })}
      </section>

      {/* ── Technical focus ── */}
      <section className="about-section" aria-labelledby="focus-title">
        <h2 id="focus-title">{profile.focusTitle}</h2>
        <p className="about-lede">{profile.focusIntro}</p>

        <div className="about-skill-grid">
          {(profile.skills || []).map(([iconKey, title, description, level]) => {
            const Icon = SKILL_ICONS[iconKey] || Code2;
            return (
              <article className="about-skill-card" key={title}>
                <div className="about-skill-top">
                  <span className="about-skill-icon"><Icon size={17} /></span>
                  <span className="skill-level">{level}</span>
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── How I work / career ── */}
      <section className="about-section" aria-labelledby="career-title">
        <h2 id="career-title">{profile.careerTitle}</h2>
        <p className="about-lede">{profile.careerIntro}</p>

        <ol className="about-strength-flow">
          {(profile.strengths || []).map((item) => (
            <li className="about-strength-step" key={item.number || item[0]}>
              <span className="about-strength-num">{item.number || item[0]}</span>
              <div>
                <h3>{item.title || item[1]}</h3>
                <p>{item.description || item[2]}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="about-cta-row">
          <Link className="button" href="/connect">
            {profile.availability} <ArrowRight size={14} />
          </Link>
          <Link className="button ghost" href="/work">
            <Send size={13} /> See the work
          </Link>
        </div>
      </section>
    </div>
  );
}
