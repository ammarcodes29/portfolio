import { useRef } from 'react';
import { useStore, type AppId } from '../state/store';
import { sfx } from '../audio/sfx';
import { AppIcon } from './icons';
import { isCoarsePointer } from '../hooks/useViewport';

interface Props { id: AppId; label: string; selected: boolean; onSelect: () => void }

export default function DesktopIcon({ id, label, selected, onSelect }: Props) {
  const openApp = useStore((s) => s.openApp);
  const lastTap = useRef(0);

  const open = () => { openApp(id); sfx.play('open', { volume: 0.7 }); };

  const onClick = () => {
    const now = performance.now();
    const dbl = now - lastTap.current < 420;
    lastTap.current = now;
    if (isCoarsePointer() || dbl) { open(); return; }
    onSelect();
    sfx.play('select', { volume: 0.5 });
  };

  return (
    <button
      type="button"
      className={`icon ${selected ? 'is-selected' : ''}`}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); open(); } }}
      onFocus={onSelect}
      aria-label={`Open ${label}`}
    >
      <span className="icon-img"><AppIcon id={id} size={40} /></span>
      <span className="icon-label">{label}</span>
    </button>
  );
}
