import { useEffect, useState } from 'react';
import { useStore, APP_META, topWindow } from '../state/store';
import { sfx } from '../audio/sfx';
import { AppIcon, SpartanLogo } from './icons';

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(id);
  }, []);
  return now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export default function Taskbar() {
  const windows = useStore((s) => s.windows);
  const topZ = useStore((s) => s.topZ);
  const startOpen = useStore((s) => s.startOpen);
  const setStartOpen = useStore((s) => s.setStartOpen);
  const focusWindow = useStore((s) => s.focusWindow);
  const toggleMinimize = useStore((s) => s.toggleMinimize);
  const muted = useStore((s) => s.muted);
  const toggleMuted = useStore((s) => s.toggleMuted);
  const time = useClock();
  const top = topWindow(windows);

  return (
    <nav className="taskbar" aria-label="Taskbar">
      <button
        type="button"
        className={`start-btn ${startOpen ? 'is-open' : ''}`}
        onClick={() => { setStartOpen(!startOpen); sfx.play('click', { volume: 0.6 }); }}
        aria-expanded={startOpen}
        aria-haspopup="menu"
      >
        <SpartanLogo width={18} height={18} />
        <span>Start</span>
      </button>
      <span className="taskbar-sep" />
      <div className="taskbar-tasks">
        {windows.map((w) => {
          const isTop = w.z === topZ && !w.minimized;
          return (
            <button
              key={w.id}
              type="button"
              className={`task ${isTop ? 'is-active' : ''} ${w.minimized ? 'is-min' : ''}`}
              onClick={() => {
                if (w.minimized || top?.id !== w.id) { if (w.minimized) toggleMinimize(w.id); else focusWindow(w.id); sfx.play('click', { volume: 0.5 }); }
                else { toggleMinimize(w.id); sfx.play('minimize', { volume: 0.6 }); }
              }}
            >
              <AppIcon id={w.id} size={16} />
              <span className="task-label">{APP_META[w.id].title}</span>
            </button>
          );
        })}
      </div>
      <div className="tray">
        <button
          type="button"
          className="tray-btn"
          onClick={() => { toggleMuted(); if (muted) sfx.play('confirm', { volume: 0.5 }); }}
          aria-pressed={!muted}
          aria-label={muted ? 'Unmute' : 'Mute'}
          title={muted ? 'Sound: off' : 'Sound: on'}
        >
          <svg viewBox="0 0 16 16" width="16" height="16" shapeRendering="crispEdges" aria-hidden="true">
            <rect x="1" y="6" width="3" height="4" fill="currentColor" />
            <rect x="4" y="4" width="2" height="8" fill="currentColor" />
            <rect x="6" y="2" width="2" height="12" fill="currentColor" />
            {muted ? (
              <path d="M10 5h1v1h1v1h1V6h1V5h1v1h-1v1h-1v1h1v1h1v1h-1v-1h-1v-1h-1v1h-1v1h-1v-1h1V9h1V8h-1V7h-1z" fill="#c8372d" />
            ) : (
              <>
                <rect x="10" y="6" width="1" height="4" fill="currentColor" />
                <rect x="12" y="4" width="1" height="8" fill="currentColor" />
                <rect x="14" y="2" width="1" height="12" fill="currentColor" />
              </>
            )}
          </svg>
        </button>
        <span className="tray-clock" aria-label="Clock">{time}</span>
      </div>
    </nav>
  );
}
