import { useState } from 'react';
import { PROJECTS } from '../../data/portfolio';
import { useStore } from '../../state/store';
import { sfx } from '../../audio/sfx';
import { FileGlyph } from '../icons';

export default function Projects({ initial }: { initial?: string }) {
  const [slug, setSlug] = useState(initial ?? PROJECTS[0].slug);
  const [seen, setSeen] = useState(initial);
  const openApp = useStore((s) => s.openApp);
  // a new `initial` (e.g. from the terminal) re-targets the selection during render
  if (initial !== seen) { setSeen(initial); if (initial) setSlug(initial); }
  const p = PROJECTS.find((x) => x.slug === slug) ?? PROJECTS[0];

  return (
    <div className="app explorer">
      <div className="explorer-toolbar">
        <span className="explorer-path">C:\AMMAR\PROJECTS\</span>
        <span className="muted">{PROJECTS.length} objects</span>
      </div>
      <div className="explorer-split">
        <ul className="explorer-list" role="listbox" aria-label="Projects">
          {PROJECTS.map((x) => (
            <li key={x.slug}>
              <button
                type="button"
                role="option"
                aria-selected={x.slug === slug}
                className={`explorer-item ${x.slug === slug ? 'is-selected' : ''}`}
                onClick={() => { setSlug(x.slug); sfx.play('select', { volume: 0.45 }); }}
              >
                <FileGlyph name={x.file} />
                <span className="explorer-item-name">{x.file}</span>
                {x.featured && <span className="star" title="Featured">★</span>}
              </button>
            </li>
          ))}
        </ul>
        <section className="explorer-detail" key={p.slug}>
          <header>
            <h1>{p.name}</h1>
            <span className="muted">{p.year}</span>
          </header>
          <p className="lede">{p.blurb}</p>
          <ul className="bullets">
            {p.details.map((d, i) => <li key={i}>{d}</li>)}
          </ul>
          <div className="chips">{p.stack.map((s) => <span key={s} className="chip">{s}</span>)}</div>
          <div className="detail-actions">
            {p.repo && <a className="btn" href={p.repo} target="_blank" rel="noreferrer" onClick={() => sfx.play('click', { volume: 0.5 })}>View on GitHub ↗</a>}
            {p.live && <a className="btn btn-primary" href={p.live} target="_blank" rel="noreferrer" onClick={() => sfx.play('click', { volume: 0.5 })}>Open live site ↗</a>}
            {p.slug === 'voidrunner' && <button type="button" className="btn btn-primary" onClick={() => { openApp('voidrunner'); sfx.play('open', { volume: 0.6 }); }}>Play it here ▶</button>}
          </div>
        </section>
      </div>
    </div>
  );
}
