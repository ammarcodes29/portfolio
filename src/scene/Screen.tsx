import { useStore } from '../state/store';
import { GLASS, SURFACE } from './sceneConfig';
import Boot from '../boot/Boot';
import Desktop from '../os/Desktop';

interface Props { hideDesktop: boolean }

/**
 * The CRT glass. Holds a logical SURFACE (1024×~760) that is scaled down to
 * the glass rectangle in the photo. The stage zoom scales it back up, so the
 * OS is always "really" on the monitor.
 */
export default function Screen({ hideDesktop }: Props) {
  const phase = useStore((s) => s.phase);
  const on = phase !== 'off';
  const k = GLASS.w / SURFACE.w;

  return (
    <div
      className={`glass ${on ? 'is-on' : 'is-off'} ${phase === 'shutdown' ? 'is-closing' : ''}`}
      style={{ left: GLASS.x, top: GLASS.y, width: GLASS.w, height: GLASS.h }}
    >
      <div className="surface" style={{ width: SURFACE.w, height: SURFACE.h, transform: `scale(${k})` }}>
        {(phase === 'powering' || phase === 'booting') && <Boot />}
        {(phase === 'desktop' || phase === 'shutdown') && !hideDesktop && <Desktop mode="framed" />}
        {(phase === 'desktop' || phase === 'shutdown') && hideDesktop && <div className="wallpaper" />}
        {phase === 'shutdown' && (
          <div className="shutdown-screen">
            <div className="shutdown-text">Shutting down SpartanOS…</div>
          </div>
        )}
        <div className="crt crt-scanlines" />
        <div className="crt crt-rgb" />
      </div>
      <div className="crt crt-vignette" />
      <div className="crt crt-reflection" />
      <div className="crt crt-flicker" />
    </div>
  );
}
