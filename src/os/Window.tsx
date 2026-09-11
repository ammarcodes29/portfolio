import { useCallback, useRef, type PointerEvent as RPointerEvent } from 'react';
import { useStore, APP_META, TASKBAR_H, clamp, type WinState } from '../state/store';
import { sfx } from '../audio/sfx';
import { AppIcon } from './icons';
import AppContent from './apps/AppContent';

interface Props { win: WinState }

export default function Window({ win }: Props) {
  const topZ = useStore((s) => s.topZ);
  const surface = useStore((s) => s.surface);
  const focusWindow = useStore((s) => s.focusWindow);
  const closeWindow = useStore((s) => s.closeWindow);
  const moveWindow = useStore((s) => s.moveWindow);
  const toggleMinimize = useStore((s) => s.toggleMinimize);
  const toggleMaximize = useStore((s) => s.toggleMaximize);
  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number; k: number } | null>(null);
  const ref = useRef<HTMLElement>(null);

  const meta = APP_META[win.id];
  const active = win.z === topZ;
  const forceMax = surface.w < 640;            // phones: every window is a sheet
  const maximized = win.maximized || forceMax;

  const onTitlePointerDown = useCallback((e: RPointerEvent<HTMLDivElement>) => {
    if (maximized || e.button !== 0) return;
    if ((e.target as HTMLElement).closest('button')) return;
    const el = ref.current;
    if (!el) return;
    // the surface may be CSS-scaled: convert viewport deltas into logical px
    const rect = el.getBoundingClientRect();
    const k = rect.width / el.offsetWidth || 1;
    drag.current = { sx: e.clientX, sy: e.clientY, ox: win.x, oy: win.y, k };
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  }, [maximized, win.x, win.y]);

  const onTitlePointerMove = useCallback((e: RPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const nx = d.ox + (e.clientX - d.sx) / d.k;
    const ny = d.oy + (e.clientY - d.sy) / d.k;
    moveWindow(
      win.id,
      clamp(nx, -win.w + 80, surface.w - 80),
      clamp(ny, 0, surface.h - TASKBAR_H - 28),
    );
  }, [moveWindow, win.id, win.w, surface.w, surface.h]);

  const onTitlePointerUp = useCallback((e: RPointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    drag.current = null;
    (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
  }, []);

  const style = maximized
    ? { left: 0, top: 0, width: surface.w, height: surface.h - TASKBAR_H, zIndex: win.z }
    : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z };

  return (
    <section
      ref={ref}
      className={`window ${active ? 'is-active' : ''} ${maximized ? 'is-maximized' : ''} ${win.minimized ? 'is-minimized' : ''}`}
      style={style}
      onPointerDown={() => focusWindow(win.id)}
      role="dialog"
      aria-label={meta.title}
    >
      <div
        className="window-title"
        onPointerDown={onTitlePointerDown}
        onPointerMove={onTitlePointerMove}
        onPointerUp={onTitlePointerUp}
        onPointerCancel={onTitlePointerUp}
        onDoubleClick={() => { if (!forceMax) { toggleMaximize(win.id); sfx.play(win.maximized ? 'minimize' : 'maximize', { volume: 0.6 }); } }}
      >
        <span className="window-title-icon"><AppIcon id={win.id} size={16} /></span>
        <span className="window-title-text">{meta.title}</span>
        <span className="window-controls">
          <button type="button" className="wbtn" aria-label="Minimize" onClick={() => { toggleMinimize(win.id); sfx.play('minimize', { volume: 0.6 }); }}>
            <svg viewBox="0 0 8 8" width="8" height="8" shapeRendering="crispEdges"><rect x="1" y="6" width="6" height="2" fill="currentColor" /></svg>
          </button>
          {!forceMax && (
            <button type="button" className="wbtn" aria-label={win.maximized ? 'Restore' : 'Maximize'} onClick={() => { toggleMaximize(win.id); sfx.play(win.maximized ? 'minimize' : 'maximize', { volume: 0.6 }); }}>
              <svg viewBox="0 0 8 8" width="8" height="8" shapeRendering="crispEdges"><rect x="0" y="0" width="8" height="8" fill="currentColor" /><rect x="1" y="2" width="6" height="5" fill="var(--os-chrome)" /></svg>
            </button>
          )}
          <button type="button" className="wbtn wbtn-close" aria-label="Close" onClick={() => { closeWindow(win.id); sfx.play('close', { volume: 0.7 }); }}>
            <svg viewBox="0 0 8 8" width="8" height="8" shapeRendering="crispEdges"><path d="M1 1h2v1h1v1h1V2h1V1h2v1H7v1H6v1H5v1h1v1h1v1H5V6H4V5H3v1H2v1H0V6h1V5h1V4h1V3H2V2H1z" fill="currentColor" /></svg>
          </button>
        </span>
      </div>
      <div className="window-body">
        <AppContent id={win.id} arg={win.arg} />
      </div>
    </section>
  );
}
