import { create } from 'zustand';
import { sfx } from '../audio/sfx';

export type Phase = 'off' | 'powering' | 'booting' | 'desktop' | 'shutdown';

export type AppId =
  | 'about' | 'projects' | 'experience' | 'terminal' | 'resume'
  | 'contact' | 'navigator' | 'voidrunner' | 'trash';

export interface WinState {
  id: AppId;
  x: number; y: number; w: number; h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
  /** optional payload, e.g. which project to open */
  arg?: string;
}

export interface DialogState {
  title: string;
  message: string;
  kind: 'info' | 'error';
}

export const APP_META: Record<AppId, { title: string; w: number; h: number }> = {
  about:      { title: 'README.txt',     w: 600, h: 470 },
  projects:   { title: 'Projects',       w: 760, h: 520 },
  experience: { title: 'Experience',     w: 660, h: 520 },
  terminal:   { title: 'Terminal',       w: 660, h: 420 },
  resume:     { title: 'Resume.pdf',     w: 700, h: 580 },
  contact:    { title: 'Contact',        w: 480, h: 380 },
  navigator:  { title: 'Navigator',      w: 740, h: 540 },
  voidrunner: { title: 'VoidRunner.exe', w: 600, h: 500 },
  trash:      { title: 'Recycle Bin',    w: 500, h: 360 },
};

export const TASKBAR_H = 34;

interface Store {
  phase: Phase;
  muted: boolean;
  windows: WinState[];
  topZ: number;
  startOpen: boolean;
  dialog: DialogState | null;
  /** size of the OS surface (logical px), reported by the Desktop root */
  surface: { w: number; h: number };

  powerOn: () => void;
  startBoot: () => void;
  bootDone: () => void;
  shutdown: () => void;
  powerOff: () => void;
  toggleMuted: () => void;
  setSurface: (w: number, h: number) => void;
  setStartOpen: (open: boolean) => void;
  showDialog: (d: DialogState) => void;
  closeDialog: () => void;

  openApp: (id: AppId, arg?: string) => void;
  closeWindow: (id: AppId) => void;
  focusWindow: (id: AppId) => void;
  moveWindow: (id: AppId, x: number, y: number) => void;
  toggleMinimize: (id: AppId) => void;
  toggleMaximize: (id: AppId) => void;
}

const BASE_Z = 10;

export const useStore = create<Store>((set, get) => ({
  phase: 'off',
  muted: sfx.muted,
  windows: [],
  topZ: BASE_Z,
  startOpen: false,
  dialog: null,
  surface: { w: 1024, h: 760 },

  powerOn: () => {
    if (get().phase !== 'off') return;
    set({ phase: 'powering' });
  },
  startBoot: () => {
    if (get().phase !== 'powering') return;
    set({ phase: 'booting' });
  },
  bootDone: () => {
    if (get().phase !== 'booting') return;
    set({ phase: 'desktop' });
  },
  shutdown: () => {
    const p = get().phase;
    if (p !== 'desktop' && p !== 'booting') return;
    set({ phase: 'shutdown', startOpen: false, dialog: null });
  },
  powerOff: () => set({ phase: 'off', windows: [], topZ: BASE_Z, startOpen: false, dialog: null }),

  toggleMuted: () => {
    const muted = !get().muted;
    sfx.setMuted(muted);
    set({ muted });
  },
  setSurface: (w, h) => {
    const cur = get().surface;
    if (cur.w === w && cur.h === h) return;
    set({ surface: { w, h } });
  },
  setStartOpen: (open) => set({ startOpen: open }),
  showDialog: (dialog) => set({ dialog }),
  closeDialog: () => set({ dialog: null }),

  openApp: (id, arg) => {
    const { windows, topZ, surface } = get();
    const z = topZ + 1;
    const existing = windows.find((w) => w.id === id);
    if (existing) {
      set({
        topZ: z,
        startOpen: false,
        windows: windows.map((w) => w.id === id ? { ...w, z, minimized: false, arg: arg ?? w.arg } : w),
      });
      return;
    }
    const meta = APP_META[id];
    const w = Math.min(meta.w, surface.w - 16);
    const h = Math.min(meta.h, surface.h - TASKBAR_H - 16);
    const n = windows.length;
    const x = clamp(Math.round((surface.w - w) / 2) + (n % 5) * 26 - 40, 8, Math.max(8, surface.w - w - 8));
    const y = clamp(Math.round((surface.h - TASKBAR_H - h) / 2) + (n % 5) * 20 - 24, 8, Math.max(8, surface.h - TASKBAR_H - h - 8));
    set({
      topZ: z,
      startOpen: false,
      windows: [...windows, { id, x, y, w, h, z, minimized: false, maximized: false, arg }],
    });
  },

  closeWindow: (id) => set({ windows: get().windows.filter((w) => w.id !== id) }),

  focusWindow: (id) => {
    const { windows, topZ } = get();
    const target = windows.find((w) => w.id === id);
    if (!target || target.z === topZ) return;
    const z = topZ + 1;
    set({ topZ: z, windows: windows.map((w) => w.id === id ? { ...w, z } : w) });
  },

  moveWindow: (id, x, y) =>
    set({ windows: get().windows.map((w) => w.id === id ? { ...w, x, y } : w) }),

  toggleMinimize: (id) => {
    const { windows, topZ } = get();
    const target = windows.find((w) => w.id === id);
    if (!target) return;
    const restoring = target.minimized;
    const z = restoring ? topZ + 1 : target.z;
    set({
      topZ: restoring ? z : topZ,
      windows: windows.map((w) => w.id === id ? { ...w, minimized: !w.minimized, z } : w),
    });
  },

  toggleMaximize: (id) => {
    const { windows, topZ } = get();
    const z = topZ + 1;
    set({ topZ: z, windows: windows.map((w) => w.id === id ? { ...w, maximized: !w.maximized, minimized: false, z } : w) });
  },
}));

export function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

/** The window currently on top (not minimized), if any. */
export function topWindow(windows: WinState[]): WinState | undefined {
  return windows.filter((w) => !w.minimized).sort((a, b) => b.z - a.z)[0];
}
