import { useEffect, useState } from 'react';

export interface Viewport { w: number; h: number; mobile: boolean }

const read = (): Viewport => {
  const w = window.innerWidth, h = window.innerHeight;
  return { w, h, mobile: w < 760 || (h > w && w < 900) };
};

/**
 * Viewport size that also survives cases where no `resize` event fires
 * (embedded/preview panes being shown, bfcache restores, emulation changes):
 * a ResizeObserver on <html> catches every layout-viewport change.
 */
export function useViewport(): Viewport {
  const [v, setV] = useState<Viewport>(read);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const next = read();
        setV((prev) => (prev.w === next.w && prev.h === next.h && prev.mobile === next.mobile ? prev : next));
      });
    };
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    window.addEventListener('pageshow', update);
    document.addEventListener('visibilitychange', update);
    window.visualViewport?.addEventListener('resize', update);
    const ro = new ResizeObserver(update);
    ro.observe(document.documentElement);
    update();
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      window.removeEventListener('pageshow', update);
      document.removeEventListener('visibilitychange', update);
      window.visualViewport?.removeEventListener('resize', update);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);
  return v;
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isCoarsePointer(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
}
