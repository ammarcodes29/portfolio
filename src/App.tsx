import { useEffect } from 'react';
import { useStore } from './state/store';
import { sfx } from './audio/sfx';
import { useViewport, prefersReducedMotion } from './hooks/useViewport';
import Scene from './scene/Scene';
import Desktop from './os/Desktop';

/**
 * App = the "conductor": it renders the scene and sequences the
 * phase timers + sound cues that are not owned by a single component.
 */
export default function App() {
  const phase = useStore((s) => s.phase);
  const startBoot = useStore((s) => s.startBoot);
  const powerOff = useStore((s) => s.powerOff);
  const vp = useViewport();
  const fullOS = vp.mobile && phase === 'desktop';

  // powering: click + CRT thump + fan, then hand over to the BIOS
  useEffect(() => {
    if (phase !== 'powering') return;
    const reduced = prefersReducedMotion();
    sfx.play('power_click', { volume: 0.9 });
    sfx.play('crt_on', { delay: 0.06 });
    sfx.loop('fan_loop', 0.16, 1500);
    const id = setTimeout(startBoot, reduced ? 250 : 700);
    return () => clearTimeout(id);
  }, [phase, startBoot]);

  // shutdown: chime, CRT collapse, fan spins down, then lights out
  useEffect(() => {
    if (phase !== 'shutdown') return;
    const reduced = prefersReducedMotion();
    sfx.play('chime_down', { volume: 0.8 });
    const zap = setTimeout(() => sfx.play('crt_off'), reduced ? 100 : 650);
    sfx.stopLoop('fan_loop', 1200);
    const id = setTimeout(powerOff, reduced ? 500 : 1700);
    return () => { clearTimeout(id); clearTimeout(zap); };
  }, [phase, powerOff]);

  // keep the document title in sync with the machine state
  useEffect(() => {
    document.title = phase === 'desktop' ? 'SpartanOS — Ammar Suleyman' : 'Ammar Suleyman — Software Engineer';
  }, [phase]);

  return (
    <>
      <Scene mobile={vp.mobile} hideDesktop={fullOS} />
      {fullOS && (
        <div className="full-os">
          <Desktop mode="full" />
        </div>
      )}
    </>
  );
}
