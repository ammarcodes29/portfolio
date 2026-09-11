import { useEffect, useState } from 'react';
import { LINKS, PROFILE } from '../../data/portfolio';
import { sfx } from '../../audio/sfx';

interface Repo { name: string; html_url: string; description: string | null; language: string | null; stargazers_count: number; pushed_at: string; fork: boolean }

let cache: Repo[] | null = null;

export default function Navigator() {
  const [repos, setRepos] = useState<Repo[] | null>(cache);
  const [state, setState] = useState<'idle' | 'loading' | 'error'>(cache ? 'idle' : 'loading');
  const home = `github.com/${PROFILE.handle}`;

  useEffect(() => {
    if (cache) return;
    let alive = true;
    fetch(`https://api.github.com/users/${PROFILE.handle}/repos?per_page=100&sort=pushed`)
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json() as Promise<Repo[]>; })
      .then((data) => {
        if (!alive) return;
        cache = data.filter((r) => !r.fork).sort((a, b) => b.stargazers_count - a.stargazers_count || b.pushed_at.localeCompare(a.pushed_at));
        setRepos(cache); setState('idle');
      })
      .catch(() => { if (alive) setState('error'); });
    return () => { alive = false; };
  }, []);

  return (
    <div className="app navigator">
      <div className="nav-bar">
        <span className="nav-btns"><span>◀</span><span>▶</span><span>⟳</span></span>
        <span className="nav-url">https://{home}</span>
        <span className="nav-spinner" aria-hidden="true">{state === 'loading' ? '●' : '○'}</span>
      </div>
      <div className="nav-page">
        <h1 className="nav-h1">Bookmarks</h1>
        <ul className="bookmarks">
          {LINKS.map((l) => (
            <li key={l.url}>
              <a href={l.url} target="_blank" rel="noreferrer" onClick={() => sfx.play('click', { volume: 0.5 })}>{l.label}</a>
              <span className="muted"> — {l.note}</span>
            </li>
          ))}
        </ul>

        <h1 className="nav-h1">Live from GitHub</h1>
        {state === 'loading' && <p className="muted">Dialing api.github.com… ♪♫ beep boop kssshhh ♪♫</p>}
        {state === 'error' && <p className="muted">Could not reach GitHub right now. <a href={PROFILE.github} target="_blank" rel="noreferrer">Open the profile directly ↗</a></p>}
        {repos && (
          <table className="file-table">
            <thead><tr><th>Repository</th><th>Language</th><th>★</th><th>Last push</th></tr></thead>
            <tbody>
              {repos.map((r) => (
                <tr key={r.name}>
                  <td><a href={r.html_url} target="_blank" rel="noreferrer">{r.name}</a>{r.description && <div className="muted small">{r.description}</div>}</td>
                  <td>{r.language ?? '—'}</td>
                  <td>{r.stargazers_count}</td>
                  <td>{r.pushed_at.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
