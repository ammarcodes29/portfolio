import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useStore, type AppId } from '../state/store';
import { sfx } from '../audio/sfx';
import DesktopIcon from './DesktopIcon';
import Window from './Window';
import Taskbar from './Taskbar';
import StartMenu from './StartMenu';
import Dialog from './Dialog';

export const DESKTOP_ICONS: { id: AppId; label: string }[] = [
  { id: 'about', label: 'README.txt' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'resume', label: 'Resume.pdf' },
  { id: 'terminal', label: 'Terminal' },
  { id: 'navigator', label: 'Navigator' },
  { id: 'contact', label: 'Contact' },
  { id: 'voidrunner', label: 'VoidRunner.exe' },
  { id: 'trash', label: 'Recycle Bin' },
];

interface Props { mode: 'framed' | 'full' }

export default function Desktop({ mode }: Props) {
  const windows = useStore((s) => s.windows);
  const startOpen = useStore((s) => s.startOpen);
  const setStartOpen = useStore((s) => s.setStartOpen);
  const setSurface = useStore((s) => s.setSurface);
  const closeWindow = useStore((s) => s.closeWindow);
  const dialog = useStore((s) => s.dialog);
  const closeDialog = useStore((s) => s.closeDialog);
  const rootRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<AppId | null>(null);

  // report the logical surface size to the store (used for window placement)
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const report = () => setSurface(el.offsetWidth, el.offsetHeight);
    report();
    const ro = new ResizeObserver(report);
    ro.observe(el);
    return () => ro.disconnect();
  }, [setSurface]);

  // first boot: open the README so the visitor is never staring at an empty desk
  useEffect(() => {
    if (useStore.getState().windows.length > 0) return;
    const id = setTimeout(() => { useStore.getState().openApp('about'); sfx.play('open', { volume: 0.6 }); }, 450);
    return () => clearTimeout(id);
  }, []);

  // Esc closes the dialog, then the start menu, then the top window
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const st = useStore.getState();
      if (st.dialog) { st.closeDialog(); return; }
      if (st.startOpen) { st.setStartOpen(false); return; }
      const top = st.windows.filter((w) => !w.minimized).sort((a, b) => b.z - a.z)[0];
      if (top) { closeWindow(top.id); sfx.play('close', { volume: 0.7 }); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeWindow]);

  const onBackgroundPointerDown = () => {
    setSelected(null);
    if (startOpen) setStartOpen(false);
  };

  return (
    <div ref={rootRef} className={`desktop mode-${mode}`} data-desktop>
      <div className="wallpaper" onPointerDown={onBackgroundPointerDown} />

      <div className="icons" onPointerDown={(e) => { if (e.target === e.currentTarget) onBackgroundPointerDown(); }}>
        {DESKTOP_ICONS.map((ic) => (
          <DesktopIcon key={ic.id} id={ic.id} label={ic.label} selected={selected === ic.id} onSelect={() => setSelected(ic.id)} />
        ))}
      </div>

      {windows.map((w) => <Window key={w.id} win={w} />)}

      {startOpen && <StartMenu />}
      {dialog && <Dialog {...dialog} onClose={closeDialog} />}

      <Taskbar />
    </div>
  );
}
