/**
 * Tiny Web Audio sound manager.
 * - Lazily creates the AudioContext on the first user gesture (autoplay-safe).
 * - Preloads OGG Vorbis files (m4a fallback where Vorbis is unsupported).
 * - One-shots via play(), ambient loops via loop()/stopLoop(), master mute.
 */
export type SfxName =
  | 'power_click' | 'crt_on' | 'crt_off' | 'post_beep' | 'hdd_seek' | 'fan_loop'
  | 'chime_up' | 'chime_down' | 'ding' | 'click' | 'tick' | 'select' | 'open'
  | 'close' | 'minimize' | 'maximize' | 'error' | 'confirm' | 'key' | 'drop' | 'glitch';

const ALL: SfxName[] = [
  'power_click', 'crt_on', 'crt_off', 'post_beep', 'hdd_seek', 'fan_loop',
  'chime_up', 'chime_down', 'ding', 'click', 'tick', 'select', 'open',
  'close', 'minimize', 'maximize', 'error', 'confirm', 'key', 'drop', 'glitch',
];

const STORAGE_KEY = 'spartanos.muted';

interface PlayOpts { volume?: number; rate?: number; delay?: number }

class SfxManager {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private buffers = new Map<SfxName, AudioBuffer>();
  private loops = new Map<SfxName, { src: AudioBufferSourceNode; gain: GainNode }>();
  private loading: Promise<void> | null = null;
  private ext: 'ogg' | 'm4a';
  muted: boolean;

  constructor() {
    this.ext = this.detectExt();
    this.muted = this.readMuted();
  }

  private detectExt(): 'ogg' | 'm4a' {
    if (typeof document === 'undefined') return 'ogg';
    const a = document.createElement('audio');
    return a.canPlayType('audio/ogg; codecs="vorbis"') ? 'ogg' : 'm4a';
  }

  private readMuted(): boolean {
    try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch { return false; }
  }

  /** Must be called from a user gesture the first time. */
  init(): void {
    if (this.ctx) { void this.ctx.resume(); return; }
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    this.ctx = new Ctor();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 1;
    this.master.connect(this.ctx.destination);
    void this.ctx.resume();
    this.loading = this.preload();
  }

  get ready(): Promise<void> { return this.loading ?? Promise.resolve(); }

  private async preload(): Promise<void> {
    const ctx = this.ctx;
    if (!ctx) return;
    await Promise.all(ALL.map(async (name) => {
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}sfx/${name}.${this.ext}`);
        const data = await res.arrayBuffer();
        const buf = await ctx.decodeAudioData(data);
        this.buffers.set(name, buf);
      } catch (err) {
        console.warn(`[sfx] failed to load ${name}`, err);
      }
    }));
  }

  play(name: SfxName, opts: PlayOpts = {}): void {
    const ctx = this.ctx, master = this.master;
    if (!ctx || !master) return;
    const buf = this.buffers.get(name);
    if (!buf) {
      // Not decoded yet: try again once loading settles (first click race).
      void this.ready.then(() => { if (this.buffers.has(name)) this.play(name, opts); });
      return;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.playbackRate.value = opts.rate ?? 1;
    const gain = ctx.createGain();
    gain.gain.value = opts.volume ?? 1;
    src.connect(gain).connect(master);
    src.start(ctx.currentTime + (opts.delay ?? 0));
  }

  loop(name: SfxName, volume = 0.3, fadeMs = 800): void {
    const ctx = this.ctx, master = this.master;
    if (!ctx || !master || this.loops.has(name)) return;
    const buf = this.buffers.get(name);
    if (!buf) { void this.ready.then(() => this.loop(name, volume, fadeMs)); return; }
    const src = ctx.createBufferSource();
    src.buffer = buf; src.loop = true;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + fadeMs / 1000);
    src.connect(gain).connect(master);
    src.start();
    this.loops.set(name, { src, gain });
  }

  stopLoop(name: SfxName, fadeMs = 600): void {
    const ctx = this.ctx;
    const entry = this.loops.get(name);
    if (!ctx || !entry) return;
    entry.gain.gain.cancelScheduledValues(ctx.currentTime);
    entry.gain.gain.setValueAtTime(Math.max(entry.gain.gain.value, 0.0001), ctx.currentTime);
    entry.gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + fadeMs / 1000);
    entry.src.stop(ctx.currentTime + fadeMs / 1000 + 0.05);
    this.loops.delete(name);
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    try { localStorage.setItem(STORAGE_KEY, muted ? '1' : '0'); } catch { /* private mode */ }
    if (this.master && this.ctx) {
      this.master.gain.cancelScheduledValues(this.ctx.currentTime);
      this.master.gain.linearRampToValueAtTime(muted ? 0 : 1, this.ctx.currentTime + 0.12);
    }
  }
}

export const sfx = new SfxManager();
