'use client';
import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ExternalLink, GitBranch, RefreshCw, GitCommit, Flame, Trophy
} from 'lucide-react';
import { projects as seedProjects } from '../../lib/data';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function WorkPage() {
  const [projectsList, setProjectsList] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [activity, setActivity] = useState(null);
  const [activityLoading, setActivityLoading] = useState(true);
  const [hoveredCell, setHoveredCell] = useState(null);

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((json) => {
        if (Array.isArray(json.data) && json.data.length > 0) setProjectsList(json.data);
        else setProjectsList(seedProjects);
      })
      .catch(() => setProjectsList(seedProjects))
      .finally(() => setProjectsLoading(false));

    fetch('/api/github-activity')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setActivity)
      .catch(() => {})
      .finally(() => setActivityLoading(false));
  }, []);

  const calendar = activity?.contributionCalendar;
  const streak = activity?.contributionStreak || { current: 0, longest: 0, total: 0 };
  const weeks = calendar?.weeks || [];

  const monthPositions = useMemo(() => {
    if (!weeks.length) return [];
    const months = [];
    let lastMonth = -1;
    weeks.forEach((week, wIdx) => {
      const firstValidDay = week.contributionDays?.find((d) => d && d.date);
      if (firstValidDay) {
        const d = new Date(firstValidDay.date);
        if (d.getMonth() !== lastMonth) {
          months.push({ name: MONTH_NAMES[d.getMonth()], colIndex: wIdx });
          lastMonth = d.getMonth();
        }
      }
    });
    return months;
  }, [weeks]);

  const formatCellDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="work-page">
      {/* ═══ Live Repositories with Source & Live Demo ═══ */}
      <section className="work-projects" aria-labelledby="work-projects-title">
        <h2 id="work-projects-title">Works, source code &amp; live demos.</h2>
        <p className="work-lede">
          Production applications, interactive browser architectures, and open-source systems with inspectable source code and live deployed demos.
        </p>

        {projectsLoading && (
          <div className="work-skeleton" aria-hidden="true">
            {[1, 2, 3].map((i) => <div key={i} className="skeleton-block" style={{ height: 74 }} />)}
          </div>
        )}

        <div className="project-list">
          {projectsList.map((project, idx) => (
            <article className="project" key={project.name || idx}>
              <span className="project-number">0{idx + 1}</span>
              <div>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
              </div>
              <span className="project-stack">{project.stack}</span>
              <div className="project-links">
                {project.code && (
                  <a href={project.code} target="_blank" rel="noopener noreferrer" className="project-link-btn" title="View Source on GitHub">
                    <GitBranch size={12} /> Source Code
                  </a>
                )}
                {project.live && (
                  <a href={project.live} target="_blank" rel="noopener noreferrer" className="project-link-btn project-link-live" title="Open Live Demo">
                    <ExternalLink size={12} /> Live Demo
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ═══ GitHub Activity & Velocity ═══ */}
      <section className="work-github" aria-labelledby="work-github-title">
        <div className="github-heading">
          <div>
            <h2 id="work-github-title">Continuous integration &amp; open source.</h2>
            <p className="work-lede">
              Live repositories, contribution calendar, and engineering velocity synchronized directly from GitHub.
            </p>
          </div>
          <a className="github-profile-link" href="https://github.com/drj7zz" target="_blank" rel="noopener noreferrer">
            View @drj7zz on GitHub <ExternalLink size={13} />
          </a>
        </div>

        <div className="streak-stats">
          <div className="streak-stat-item">
            <div className="streak-stat-header"><GitCommit size={15} className="streak-stat-icon" /><span>Total Contributions</span></div>
            <strong>{streak.total || 0}</strong>
          </div>
          <div className="streak-stat-item">
            <div className="streak-stat-header"><Flame size={15} className="streak-stat-icon" /><span>Current Streak</span></div>
            <strong>{streak.current || 0} <em className="streak-unit">days</em></strong>
          </div>
          <div className="streak-stat-item">
            <div className="streak-stat-header"><Trophy size={15} className="streak-stat-icon" /><span>Longest Streak</span></div>
            <strong>{streak.longest || 0} <em className="streak-unit">days</em></strong>
          </div>
        </div>

        {weeks.length > 0 && (
          <div className="graph-container">
            <div className="graph-tooltip-banner" aria-live="polite">
              {hoveredCell ? (
                <>
                  <span className="tooltip-count"><strong>{hoveredCell.count}</strong> {hoveredCell.count === 1 ? 'contribution' : 'contributions'}</span>
                  <span className="tooltip-date">on {formatCellDate(hoveredCell.date)}</span>
                </>
              ) : (
                <span className="tooltip-placeholder">Hover or tap any square to inspect activity</span>
              )}
            </div>

            <div className="graph-scroll-area">
              <div className="graph-table-layout">
                <div className="graph-months-row" aria-hidden="true">
                  <div className="graph-days-spacer" />
                  <div className="graph-months-track">
                    {monthPositions.map((m, idx) => (
                      <span key={`${m.name}-${idx}`} className="graph-month-label" style={{ gridColumnStart: m.colIndex + 1 }}>{m.name}</span>
                    ))}
                  </div>
                </div>

                <div className="graph-body-row">
                  <div className="graph-days-label" aria-hidden="true"><span>Mon</span><span>Wed</span><span>Fri</span></div>
                  <div className="graph-grid" role="grid" aria-label="Contribution grid for past year">
                    {weeks.map((week, wIdx) => (
                      <div className="graph-column" key={wIdx} role="row">
                        {week.contributionDays.map((day, dIdx) => {
                          const count = day.contributionCount;
                          let level = '0';
                          if (count > 0 && count <= 2) level = '1';
                          else if (count > 2 && count <= 5) level = '2';
                          else if (count > 5 && count <= 9) level = '3';
                          else if (count > 9) level = '4';
                          const isHovered = hoveredCell?.date === day.date;
                          return (
                            <button
                              type="button"
                              key={dIdx}
                              className={`graph-cell level-${level} ${isHovered ? 'is-active' : ''}`}
                              title={`${day.date}: ${count} contributions`}
                              aria-label={`${count} contributions on ${day.date}`}
                              onMouseEnter={() => setHoveredCell({ date: day.date, count })}
                              onMouseLeave={() => setHoveredCell(null)}
                              onClick={() => setHoveredCell({ date: day.date, count })}
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
              <span className="graph-scroll-hint">← Scroll horizontally to explore entire year →</span>
              <div className="graph-legend">
                <span>Less</span>
                <span className="graph-cell level-0" aria-hidden="true" />
                <span className="graph-cell level-1" aria-hidden="true" />
                <span className="graph-cell level-2" aria-hidden="true" />
                <span className="graph-cell level-3" aria-hidden="true" />
                <span className="graph-cell level-4" aria-hidden="true" />
                <span>More</span>
              </div>
            </div>
          </div>
        )}

        {activityLoading && !weeks.length && (
          <div className="graph-skeleton-wrap">
            <p style={{ color: 'var(--muted)', marginBottom: '12px', font: '11px "DM Mono", monospace' }}>
              <RefreshCw size={12} className="spin-icon" style={{ display: 'inline', marginRight: '6px' }} />
              Synchronizing GitHub activity stream...
            </p>
            <div className="graph-skeleton-grid" aria-hidden="true" />
          </div>
        )}

        {activity && (
          <div className="work-repos">
            <h3>Active Repositories ({activity.repositories?.length || 0})</h3>
            <div className="repo-list">
              {(activity.repositories || []).map((repo) => (
                <a className="repo-item" href={repo.html_url} target="_blank" rel="noopener noreferrer" key={repo.id || repo.name}>
                  <span className="repo-title"><GitBranch size={13} /> {repo.name}</span>
                  {repo.description && <span className="repo-description">{repo.description}</span>}
                  <span className="repo-meta">{repo.language || 'Code'} · ★ {repo.stargazers_count || 0}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
