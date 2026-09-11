import { useEffect, useRef, useState } from 'react';
import { useStore } from '../state/store';
import { sfx } from '../audio/sfx';
import { OS } from '../data/portfolio';
import { prefersReducedMotion } from '../hooks/useViewport';
import { SpartanLogo } from '../os/icons';

interface Line { t: number; html: string }

const MEM_TOTAL = 65536;

/** BIOS lines: time (ms) after boot start → text. `{{mem}}` is live. */
const LINES: Line[] = [
  { t: 0,    html: `<span class="dim">${OS.vendor} · ${OS.model}</span>` },
  { t: 60,   html: `BIOS v2.7.1  (C) 1998-${OS.year}  <span class="dim">Build 0910</span>` },
  { t: 320,  html: 'CPU : Spartan Core @ 3.3 GHz &nbsp;<span class="ok">OK</span>' },
  { t: 520,  html: 'Memory Test : {{mem}}K' },
  { t: 1450, html: 'Detecting IDE drives ...' },
  { t: 1700, html: '&nbsp; Primary Master &nbsp;: AE-HDD 40.0 GB &nbsp;<span class="ok">[PORTFOLIO]</span>' },
  { t: 1900, html: '&nbsp; Primary Slave &nbsp;&nbsp;: AE-CDROM 52X' },
  { t: 2050, html: '&nbsp; Secondary Master: <span class="dim">None</span>' },
  { t: 2250, html: 'Keyboard ......... <span class="ok">Detected</span>' },
  { t: 2350, html: 'Mouse ............ <span class="ok">Detected</span>' },
  { t: 2480, html: 'Sound Blaster .... <span class="ok">Detected</span> <span class="dim">(OGG Vorbis)</span>' },
  { t: 2650, html: 'Coffee ........... <span class="warn">Low</span>' },
  { t: 2900, html: `Loading ${OS.name} ${OS.version} ...` },
];

const SPLASH_AT = 3350;
const DONE_AT = 5600;

export default function Boot() {
  const phase = useStore((s) => s.phase);
  const bootDone = useStore((s) => s.bootDone);
  const [visible, setVisible] = useState(0);
  const [mem, setMem] = useState(0);
  const [splash, setSplash] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (phase !== 'booting' || started.current) return;
    started.current = true;
    const reduced = prefersReducedMotion();
    const speed = reduced ? 0.45 : 1;
    const timers: number[] = [];
    const at = (t: number, fn: () => void) => timers.push(window.setTimeout(fn, t * speed));

    LINES.forEach((l, i) => at(l.t, () => setVisible(i + 1)));

    // memory count-up (520 → 1400ms)
    const memStart = 520, memDur = 880;
    const t0 = performance.now();
    let raf = 0;
    const tick = () => {
      const el = (performance.now() - t0) / speed;
      const p = Math.min(1, Math.max(0, (el - memStart) / memDur));
      setMem(Math.round(MEM_TOTAL * (1 - Math.pow(1 - p, 2))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    at(280, () => sfx.play('post_beep'));
    at(1500, () => sfx.play('hdd_seek', { volume: 0.7 }));
    at(SPLASH_AT, () => { setSplash(true); sfx.play('chime_up'); });
    at(DONE_AT, bootDone);

    return () => { timers.forEach(clearTimeout); cancelAnimationFrame(raf); };
  }, [phase, bootDone]);

  // any key / click skips the boot
  useEffect(() => {
    if (phase !== 'booting') return;
    const skip = (e: KeyboardEvent | PointerEvent) => {
      if (e instanceof KeyboardEvent && (e.metaKey || e.ctrlKey || e.altKey)) return;
      bootDone();
    };
    window.addEventListener('keydown', skip);
    return () => window.removeEventListener('keydown', skip);
  }, [phase, bootDone]);

  if (splash) {
    return (
      <div className="splash" onClick={bootDone} role="presentation">
        <div className="splash-inner">
          <SpartanLogo className="splash-logo" />
          <div className="splash-name">Spartan<em>OS</em></div>
          <div className="splash-sub">{OS.vendor} · Version {OS.version}</div>
          <div className="splash-bar"><div className="splash-bar-fill" /></div>
          <div className="splash-status">Starting SpartanOS…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="boot" onClick={phase === 'booting' ? bootDone : undefined} role="presentation">
      {phase === 'booting' && (
        <>
          <div className="boot-header">
            <span className="boot-brand"><SpartanLogo className="boot-logo" />{OS.vendor.toUpperCase()}</span>
            <span className="dim">Press any key to skip</span>
          </div>
          {LINES.slice(0, visible).map((l, i) => (
            <div
              key={i}
              className={`boot-line ${i === visible - 1 && !splash ? 'boot-cursor' : ''}`}
              dangerouslySetInnerHTML={{ __html: l.html.replace('{{mem}}', mem.toString().padStart(5, ' ')) }}
            />
          ))}
          {visible === 0 && <div className="boot-line boot-cursor" />}
        </>
      )}
    </div>
  );
}
