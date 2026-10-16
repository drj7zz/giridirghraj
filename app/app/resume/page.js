'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Github, Mail, MapPin, Printer } from 'lucide-react';
import { facts as seedFacts, projects as seedProjects, skills as seedSkills, socialLinks } from '../../lib/data';

export default function ResumePage() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState(seedProjects);
  const [links, setLinks] = useState(socialLinks);

  useEffect(() => {
    async function loadResumeData() {
      const results = await Promise.allSettled([
        fetch('/api/profile'),
        fetch('/api/projects'),
        fetch('/api/site-info')
      ]);

      const [profileResult, projectsResult, infoResult] = results;

      if (profileResult.status === 'fulfilled' && profileResult.value.ok) {
        const response = await profileResult.value.json();
        setProfile(response.data || null);
      }
      if (projectsResult.status === 'fulfilled' && projectsResult.value.ok) {
        const response = await projectsResult.value.json();
        if (Array.isArray(response.data)) setProjects(response.data);
      }
      if (infoResult.status === 'fulfilled' && infoResult.value.ok) {
        const response = await infoResult.value.json();
        if (Array.isArray(response?.data?.socialLinks)) setLinks(response.data.socialLinks);
      }
    }

    loadResumeData().catch((error) => console.error('Unable to load current résumé details.', error));
  }, []);

  const profileFacts = profile?.facts || seedFacts;
  const education = profileFacts.find(([label]) => label.toLowerCase() === 'education');
  const educationText = profile?.resumeEducation || (education ? education[1].join(' ') : '');
  const skills = profile?.resumeSkills
    ? (Array.isArray(profile.resumeSkills) ? profile.resumeSkills : profile.resumeSkills.split(','))
      .map((skill) => skill.trim())
      .filter(Boolean)
    : seedSkills.map((skill) => skill[1]);
  const email = links.find((link) => link.url?.startsWith('mailto:'));
  const github = links.find((link) => link.name?.toLowerCase() === 'github');

  return (
    <div className="resume-page">
      <div className="resume-toolbar">
        <Link href="/" className="resume-back"><ArrowLeft size={15} /> Back to portfolio</Link>
        <button type="button" className="resume-print" onClick={() => window.print()}>
          <Printer size={15} /> Print / Save as PDF
        </button>
      </div>

      <article className="resume-sheet">
        <header className="resume-header">
          <div>
            <p className="resume-overline">Curriculum vitae</p>
            <h1>Dirghraj Giri</h1>
            <p className="resume-role">{profile?.resumeRole || 'Software Developer · Founder of KAALYUG'}</p>
          </div>
          <div className="resume-contact-list">
            <span><MapPin size={14} /> Madhesh, Nepal</span>
            {email && <a href={email.url}><Mail size={14} /> {email.url.replace(/^mailto:/, '')}</a>}
            {github && <a href={github.url} target="_blank" rel="noopener noreferrer"><Github size={14} /> GitHub <ArrowUpRight size={12} /></a>}
            <a href="https://kaalyug.vercel.app" target="_blank" rel="noopener noreferrer">KAALYUG <ArrowUpRight size={12} /></a>
          </div>
        </header>

        <section className="resume-section" aria-labelledby="resume-profile">
          <h2 id="resume-profile">Profile</h2>
          <p>{profile?.intro || 'Developer and open-source contributor from Madhesh, Nepal, building useful and reliable software.'}</p>
          {profile?.kaalyugNote && <p>{profile.kaalyugNote}</p>}
        </section>

        {educationText && (
          <section className="resume-section" aria-labelledby="resume-education">
            <h2 id="resume-education">Education</h2>
            <p>{educationText}</p>
          </section>
        )}

        <section className="resume-section" aria-labelledby="resume-skills">
          <h2 id="resume-skills">Skills &amp; focus</h2>
          <div className="resume-skills">
            {skills.map((skill) => (
            <div className="resume-skill" key={skill}>
              <strong>{skill}</strong>
            </div>
            ))}
          </div>
        </section>

        <section className="resume-section" aria-labelledby="resume-projects">
          <div className="resume-section-heading">
            <h2 id="resume-projects">Selected works</h2>
            <span>Maintained in portfolio admin</span>
          </div>
          <div className="resume-projects">
            {projects.map((project) => (
              <article className="resume-project" key={project.id || project.name}>
                <div>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <span className="resume-project-stack">{Array.isArray(project.stack) ? project.stack.join(' · ') : project.stack}</span>
                </div>
                <div className="resume-project-links">
                  {project.live && <a href={project.live} target="_blank" rel="noopener noreferrer">Live <ArrowUpRight size={12} /></a>}
                  {project.code && <a href={project.code} target="_blank" rel="noopener noreferrer">Source <ArrowUpRight size={12} /></a>}
                </div>
              </article>
            ))}
          </div>
        </section>

        <footer className="resume-footer">
          <span>Profile, skills, projects, and contact details are maintained in the portfolio admin.</span>
          <a href="https://kaalyug.vercel.app" target="_blank" rel="noopener noreferrer">kaalyug.vercel.app</a>
        </footer>
      </article>
    </div>
  );
}
