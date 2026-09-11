import { useEffect, useRef } from 'react';
import { sfx } from '../audio/sfx';
import type { DialogState } from '../state/store';

export default function Dialog({ title, message, kind, onClose }: DialogState & { onClose: () => void }) {
  const ok = useRef<HTMLButtonElement>(null);
  useEffect(() => { ok.current?.focus({ preventScroll: true }); sfx.play(kind === 'error' ? 'error' : 'ding', { volume: 0.7 }); }, [kind]);
  return (
    <div className="dialog-backdrop" role="presentation">
      <div className="dialog window is-active" role="alertdialog" aria-modal="true" aria-labelledby="dlg-title">
        <div className="window-title"><span className="window-title-text" id="dlg-title">{title}</span></div>
        <div className="dialog-body">
          <div className={`dialog-glyph ${kind}`} aria-hidden="true">{kind === 'error' ? '✕' : 'i'}</div>
          <p>{message}</p>
        </div>
        <div className="dialog-actions">
          <button ref={ok} type="button" className="btn" onClick={() => { onClose(); sfx.play('click', { volume: 0.5 }); }}>OK</button>
        </div>
      </div>
    </div>
  );
}
