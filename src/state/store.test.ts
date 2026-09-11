import { beforeEach, describe, expect, it } from 'vitest';
import { useStore, topWindow } from './store';

const reset = () => useStore.getState().powerOff();

describe('phase machine', () => {
  beforeEach(reset);

  it('walks off → powering → booting → desktop → shutdown → off', () => {
    const s = useStore.getState();
    expect(s.phase).toBe('off');
    s.powerOn();            expect(useStore.getState().phase).toBe('powering');
    s.startBoot();          expect(useStore.getState().phase).toBe('booting');
    s.bootDone();           expect(useStore.getState().phase).toBe('desktop');
    s.shutdown();           expect(useStore.getState().phase).toBe('shutdown');
    s.powerOff();           expect(useStore.getState().phase).toBe('off');
  });

  it('ignores out-of-order transitions', () => {
    const s = useStore.getState();
    s.bootDone();  expect(useStore.getState().phase).toBe('off');
    s.shutdown();  expect(useStore.getState().phase).toBe('off');
    s.startBoot(); expect(useStore.getState().phase).toBe('off');
    s.powerOn(); s.powerOn(); expect(useStore.getState().phase).toBe('powering');
  });

  it('allows shutdown while booting (skip + power button)', () => {
    const s = useStore.getState();
    s.powerOn(); s.startBoot(); s.shutdown();
    expect(useStore.getState().phase).toBe('shutdown');
  });

  it('powerOff clears windows and dialogs', () => {
    const s = useStore.getState();
    s.powerOn(); s.startBoot(); s.bootDone();
    s.openApp('about'); s.showDialog({ title: 't', message: 'm', kind: 'info' });
    s.shutdown(); s.powerOff();
    expect(useStore.getState().windows).toHaveLength(0);
    expect(useStore.getState().dialog).toBeNull();
  });
});

describe('window manager', () => {
  beforeEach(() => { reset(); useStore.getState().setSurface(1024, 760); });

  it('opens a window once and re-focuses on reopen', () => {
    const s = useStore.getState();
    s.openApp('about'); s.openApp('projects'); s.openApp('about');
    const wins = useStore.getState().windows;
    expect(wins).toHaveLength(2);
    expect(topWindow(wins)?.id).toBe('about');
  });

  it('keeps windows inside the surface', () => {
    const s = useStore.getState();
    s.setSurface(400, 300);
    s.openApp('projects');
    const w = useStore.getState().windows[0];
    expect(w.w).toBeLessThanOrEqual(400 - 16);
    expect(w.x).toBeGreaterThanOrEqual(8);
    expect(w.y).toBeGreaterThanOrEqual(8);
  });

  it('focus raises z-order; close removes', () => {
    const s = useStore.getState();
    s.openApp('about'); s.openApp('projects');
    s.focusWindow('about');
    expect(topWindow(useStore.getState().windows)?.id).toBe('about');
    s.closeWindow('about');
    expect(useStore.getState().windows.map((w) => w.id)).toEqual(['projects']);
  });

  it('minimize hides from topWindow, restore brings back on top', () => {
    const s = useStore.getState();
    s.openApp('about'); s.openApp('projects');
    s.toggleMinimize('projects');
    expect(topWindow(useStore.getState().windows)?.id).toBe('about');
    s.toggleMinimize('projects');
    expect(topWindow(useStore.getState().windows)?.id).toBe('projects');
  });

  it('maximize toggles and un-minimizes', () => {
    const s = useStore.getState();
    s.openApp('about'); s.toggleMinimize('about'); s.toggleMaximize('about');
    const w = useStore.getState().windows[0];
    expect(w.maximized).toBe(true);
    expect(w.minimized).toBe(false);
  });

  it('opening an app passes an argument through', () => {
    const s = useStore.getState();
    s.openApp('projects', 'elafate');
    expect(useStore.getState().windows[0].arg).toBe('elafate');
    s.openApp('projects', 'voidrunner');
    expect(useStore.getState().windows[0].arg).toBe('voidrunner');
  });
});
