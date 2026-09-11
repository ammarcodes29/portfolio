import { useEffect, useRef } from 'react';
import { useStore, APP_META, type AppId } from '../state/store';
import { sfx } from '../audio/sfx';
import { AppIcon } from './icons';
import { OS, PROFILE } from '../data/portfolio';

const PROGRAMS: AppId[] = ['about', 'projects', 'experience', 'terminal', 'navigator', 'voidrunner'];

export default function StartMenu() {
  const openApp = useStore((s) => s.openApp);
  const setStartOpen = useStore((s) => s.setStartOpen);
  const shutdown = useStore((s) => s.shutdown);
  const muted = useStore((s) => s.muted);
  const toggleMuted = useStore((s) => s.toggleMuted);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { ref.current?.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true }); }, []);

  const launch = (id: AppId) => { openApp(id); sfx.play('open', { volume: 0.7 }); };

  return (
    <div ref={ref} className="start-menu" role="menu" aria-label="Start menu">
      <div className="start-side"><span>{OS.name} {OS.version}</span></div>
      <div className="start-items">
        <div className="start-group">Programs</div>
        {PROGRAMS.map((id) => (
          <button key={id} type="button" role="menuitem" className="start-item" onClick={() => launch(id)}>
            <AppIcon id={id} size={20} /> <span>{APP_META[id].title}</span>
          </button>
        ))}
        <div className="start-group">Documents</div>
        <button type="button" role="menuitem" className="start-item" onClick={() => launch('resume')}>
          <AppIcon id="resume" size={20} /> <span>Resume.pdf</span>
        </button>
        <button type="button" role="menuitem" className="start-item" onClick={() => launch('contact')}>
          <AppIcon id="contact" size={20} /> <span>Contact {PROFILE.name.split(' ')[0]}</span>
        </button>
        <div className="start-sep" />
        <button type="button" role="menuitemcheckbox" aria-checked={!muted} className="start-item" onClick={() => { toggleMuted(); sfx.play('click', { volume: 0.5 }); }}>
          <span className="start-glyph">{muted ? '○' : '●'}</span> <span>Sound {muted ? 'off' : 'on'}</span>
        </button>
        <button type="button" role="menuitem" className="start-item" onClick={() => { setStartOpen(false); shutdown(); }}>
          <span className="start-glyph">⏻</span> <span>Shut Down…</span>
        </button>
      </div>
    </div>
  );
}
