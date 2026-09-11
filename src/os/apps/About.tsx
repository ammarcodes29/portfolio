import { useStore } from '../../state/store';
import { sfx } from '../../audio/sfx';
import { PROFILE, EDUCATION, SKILLS } from '../../data/portfolio';

export default function About() {
  const openApp = useStore((s) => s.openApp);
  const go = (id: 'projects' | 'experience' | 'contact' | 'resume') => { openApp(id); sfx.play('open', { volume: 0.6 }); };
  return (
    <article className="app about">
      <header className="about-head">
        <span className="about-avatar" aria-hidden="true">
          <span className="about-monogram">AS</span>
          <img src={PROFILE.avatar} alt="" width={72} height={72} loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </span>
        <div>
          <h1 className="about-name">{PROFILE.name}</h1>
          <p className="about-title">{PROFILE.title}</p>
          <p className="about-loc">{PROFILE.location} · <a href={PROFILE.github} target="_blank" rel="noreferrer">@{PROFILE.handle}</a></p>
        </div>
      </header>

      <p className="lede">{PROFILE.tagline}</p>
      {PROFILE.bio.map((p, i) => <p key={i}>{p}</p>)}

      <div className="about-actions">
        <button type="button" className="btn btn-primary" onClick={() => go('projects')}>Browse projects</button>
        <button type="button" className="btn" onClick={() => go('experience')}>Experience</button>
        <button type="button" className="btn" onClick={() => go('resume')}>Resume</button>
        <button type="button" className="btn" onClick={() => go('contact')}>Say hi</button>
      </div>

      <h2>Education</h2>
      <p><strong>{EDUCATION.school}</strong> — {EDUCATION.degree}, {EDUCATION.period}</p>
      <p className="muted">Coursework: {EDUCATION.coursework.join(' · ')}</p>

      <h2>Skills</h2>
      {Object.entries(SKILLS).map(([group, items]) => (
        <div key={group} className="skill-row">
          <span className="skill-group">{group}</span>
          <span className="chips">{items.map((s) => <span key={s} className="chip">{s}</span>)}</span>
        </div>
      ))}

      <p className="muted small">
        You are reading this inside SpartanOS, a fake operating system I built for this portfolio: React 19, TypeScript, Zustand, CSS transforms, and Web Audio with real OGG sound effects. Try the Terminal.
      </p>
    </article>
  );
}
