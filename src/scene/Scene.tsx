import type { CSSProperties } from 'react';
import { useStore, clamp } from '../state/store';
import { sfx } from '../audio/sfx';
import { useViewport } from '../hooks/useViewport';
import { SCENE, GLASS, POWER, LED, FRAME_Y } from './sceneConfig';
import Screen from './Screen';
import { PROFILE } from '../data/portfolio';

interface Props { mobile: boolean; hideDesktop: boolean }

/**
 * The photographic stage. A fixed-size (image pixel) div is translated and
 * scaled to either cover the viewport (machine off) or push into the CRT
 * glass (machine on). Everything on the desk — screen, LED, power button —
 * is a child positioned in image pixels, so it rides along with the zoom.
 */
export default function Scene({ mobile, hideDesktop }: Props) {
  const phase = useStore((s) => s.phase);
  const powerOn = useStore((s) => s.powerOn);
  const shutdown = useStore((s) => s.shutdown);
  const muted = useStore((s) => s.muted);
  const toggleMuted = useStore((s) => s.toggleMuted);
  const { w: vw, h: vh } = useViewport();

  const on = phase !== 'off';
  const zoomed = phase === 'powering' || phase === 'booting' || phase === 'desktop';

  const gx = GLASS.x + GLASS.w / 2;
  const gy = GLASS.y + GLASS.h / 2;

  let s: number, tx: number, ty: number;
  if (!zoomed) {
    s = Math.max(vw / SCENE.w, vh / SCENE.h);
    const sw = SCENE.w * s, sh = SCENE.h * s;
    tx = clamp(vw / 2 - gx * s, vw - sw, 0);
    ty = clamp(vh * FRAME_Y - gy * s, vh - sh, 0);
  } else {
    const pad = mobile ? 1.0 : 1.10;
    s = Math.min(vw / (GLASS.w * pad), vh / (GLASS.h * pad));
    tx = vw / 2 - gx * s;
    ty = vh / 2 - gy * s;
  }

  const handlePower = () => {
    if (phase === 'off') {
      sfx.init();
      powerOn();
    } else if (phase === 'desktop' || phase === 'booting') {
      shutdown();
    }
  };

  const stageStyle: CSSProperties = {
    width: SCENE.w,
    height: SCENE.h,
    transform: `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${s.toFixed(4)})`,
  };

  return (
    <div className={`viewport phase-${phase} ${zoomed ? 'is-zoomed' : ''} ${mobile ? 'is-mobile' : ''}`}>
      <div className="stage" style={stageStyle}>
        <img className="stage-bg" src={SCENE.src} alt="" draggable={false} width={SCENE.w} height={SCENE.h} />

        {/* light spilling from the CRT onto the desk and bezel */}
        <div
          className={`spill ${on ? 'is-on' : ''}`}
          style={{ left: GLASS.x - 90, top: GLASS.y - 60, width: GLASS.w + 180, height: GLASS.h + 200 }}
        />

        <Screen hideDesktop={hideDesktop} />

        <div
          className={`led ${on ? 'is-on' : ''}`}
          style={{ left: LED.x - LED.r, top: LED.y - LED.r, width: LED.r * 2, height: LED.r * 2 }}
        />

        <button
          type="button"
          className={`power-btn ${phase === 'off' ? 'is-idle' : ''}`}
          style={{ left: POWER.x, top: POWER.y, width: POWER.w, height: POWER.h }}
          onClick={handlePower}
          disabled={phase === 'powering' || phase === 'shutdown'}
          aria-label={on ? 'Power off the computer' : 'Power on the computer'}
          title={on ? 'Power off' : 'Power on'}
        >
          <span className="power-ring" aria-hidden="true" />
        </button>
      </div>

      {/* HUD: lives outside the zoom */}
      <header className={`hud hud-top ${on ? 'is-hidden' : ''}`}>
        <div className="hud-name">{PROFILE.name}</div>
        <div className="hud-title">{PROFILE.title}</div>
      </header>

      <div className={`hud hud-bottom ${on ? 'is-hidden' : ''}`}>
        {mobile ? (
          <button type="button" className="hud-power" onClick={handlePower}>
            <span className="hud-power-glyph">⏻</span> Power on
          </button>
        ) : (
          <div className="hud-hint">Press the power button on the tower to boot</div>
        )}
      </div>

      <button
        type="button"
        className="hud hud-sound"
        onClick={() => { sfx.init(); toggleMuted(); }}
        aria-pressed={!muted}
        aria-label={muted ? 'Unmute sound' : 'Mute sound'}
        title={muted ? 'Sound off' : 'Sound on'}
      >
        {muted ? '🔇' : '🔊'}
      </button>
    </div>
  );
}
