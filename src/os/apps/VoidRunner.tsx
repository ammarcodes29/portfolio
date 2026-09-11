import { useEffect, useRef, useState } from 'react';
import { useStore, topWindow } from '../../state/store';
import { sfx } from '../../audio/sfx';

const W = 480, H = 360;

interface Vec { x: number; y: number }
interface Bullet extends Vec { vy: number }
interface Enemy extends Vec { hp: number; vx: number; vy: number; r: number }
interface Particle extends Vec { vx: number; vy: number; life: number; c: string }

/** A small canvas homage to VoidRunner (the Pygame original lives on GitHub). */
export default function VoidRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<'ready' | 'playing' | 'over'>('ready');
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => { try { return Number(localStorage.getItem('voidrunner.best') ?? 0); } catch { return 0; } });
  const statusRef = useRef(status);
  useEffect(() => { statusRef.current = status; }, [status]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    // take the keyboard away from whatever icon/button launched us
    const focusTimer = window.setTimeout(() => canvas.focus({ preventScroll: true }), 30);
    const keys = new Set<string>();
    let raf = 0, last = performance.now(), t = 0;
    let ship: Vec = { x: W / 2, y: H - 40 };
    let bullets: Bullet[] = [], enemies: Enemy[] = [], parts: Particle[] = [];
    let cooldown = 0, spawn = 0, wave = 1, sc = 0, alive = true, inv = 0, lives = 3;
    const stars = Array.from({ length: 70 }, () => ({ x: Math.random() * W, y: Math.random() * H, s: Math.random() * 1.5 + 0.3 }));

    const isTop = () => topWindow(useStore.getState().windows)?.id === 'voidrunner';
    const boom = (x: number, y: number, c: string, n = 14) => {
      for (let i = 0; i < n; i++) parts.push({ x, y, vx: (Math.random() - 0.5) * 160, vy: (Math.random() - 0.5) * 160, life: 0.5 + Math.random() * 0.4, c });
    };
    const reset = () => { ship = { x: W / 2, y: H - 40 }; bullets = []; enemies = []; parts = []; wave = 1; sc = 0; alive = true; lives = 3; spawn = 0; setScore(0); };

    const onDown = (e: KeyboardEvent) => {
      if (!isTop()) return;
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) e.preventDefault();
      keys.add(e.key.toLowerCase());
      if ((e.key === ' ' || e.key === 'Enter') && statusRef.current !== 'playing') { reset(); setStatus('playing'); sfx.play('confirm', { volume: 0.5 }); }
    };
    const onUp = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase());
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
      // background
      ctx.fillStyle = '#070914'; ctx.fillRect(0, 0, W, H);
      for (const s of stars) { s.y += s.s * 40 * dt; if (s.y > H) { s.y = 0; s.x = Math.random() * W; } ctx.fillStyle = `rgba(255,255,255,${0.35 + s.s * 0.3})`; ctx.fillRect(s.x, s.y, s.s > 1 ? 2 : 1, s.s > 1 ? 2 : 1); }

      if (statusRef.current === 'playing' && alive) {
        const sp = 240;
        if (keys.has('arrowleft') || keys.has('a')) ship.x -= sp * dt;
        if (keys.has('arrowright') || keys.has('d')) ship.x += sp * dt;
        if (keys.has('arrowup') || keys.has('w')) ship.y -= sp * dt;
        if (keys.has('arrowdown') || keys.has('s')) ship.y += sp * dt;
        ship.x = Math.max(12, Math.min(W - 12, ship.x)); ship.y = Math.max(H / 2, Math.min(H - 14, ship.y));
        cooldown -= dt;
        if (keys.has(' ') && cooldown <= 0) { bullets.push({ x: ship.x, y: ship.y - 12, vy: -420 }); cooldown = 0.18; sfx.play('tick', { volume: 0.35, rate: 1.6 }); }
        spawn -= dt;
        if (spawn <= 0) {
          const r = 9 + Math.random() * 6;
          enemies.push({ x: 20 + Math.random() * (W - 40), y: -20, hp: r > 13 ? 2 : 1, vx: (Math.random() - 0.5) * 80, vy: 50 + wave * 12 + Math.random() * 30, r });
          spawn = Math.max(0.28, 1.1 - wave * 0.08);
        }
        inv = Math.max(0, inv - dt);
      }

      bullets = bullets.filter((b) => (b.y += b.vy * dt) > -10);
      for (const e of enemies) { e.x += e.vx * dt; e.y += e.vy * dt; if (e.x < e.r || e.x > W - e.r) e.vx *= -1; }
      // collisions
      for (const e of enemies) {
        for (const b of bullets) {
          if (Math.hypot(e.x - b.x, e.y - b.y) < e.r + 3) { b.y = -99; e.hp -= 1; if (e.hp <= 0) { boom(e.x, e.y, '#ffb347'); sc += e.r > 13 ? 25 : 10; setScore(sc); sfx.play('glitch', { volume: 0.25, rate: 1.4 }); } else sfx.play('tick', { volume: 0.25 }); }
        }
        if (alive && inv <= 0 && statusRef.current === 'playing' && Math.hypot(e.x - ship.x, e.y - ship.y) < e.r + 9) {
          e.hp = 0; boom(ship.x, ship.y, '#ff6a3d', 26); lives -= 1; inv = 1.5; sfx.play('error', { volume: 0.5 });
          if (lives <= 0) { alive = false; setStatus('over'); if (sc > best) { setBest(sc); try { localStorage.setItem('voidrunner.best', String(sc)); } catch { /* ignore */ } } }
        }
      }
      enemies = enemies.filter((e) => e.hp > 0 && e.y < H + 30);
      if (statusRef.current === 'playing' && sc >= wave * 150) { wave += 1; sfx.play('ding', { volume: 0.5 }); }
      parts = parts.filter((p) => (p.life -= dt) > 0);
      for (const p of parts) { p.x += p.vx * dt; p.y += p.vy * dt; ctx.fillStyle = p.c; ctx.globalAlpha = Math.max(0, p.life); ctx.fillRect(p.x, p.y, 3, 3); }
      ctx.globalAlpha = 1;

      // draw enemies
      for (const e of enemies) { ctx.fillStyle = e.hp > 1 ? '#c8372d' : '#9fb9de'; ctx.beginPath(); ctx.moveTo(e.x, e.y + e.r); ctx.lineTo(e.x - e.r, e.y - e.r * 0.6); ctx.lineTo(e.x + e.r, e.y - e.r * 0.6); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#070914'; ctx.fillRect(e.x - 2, e.y - 2, 4, 4); }
      // bullets
      ctx.fillStyle = '#9dffb0'; for (const b of bullets) ctx.fillRect(b.x - 1.5, b.y - 6, 3, 10);
      // ship
      if (alive && (inv <= 0 || Math.floor(t * 12) % 2 === 0)) {
        ctx.fillStyle = '#e4dfd2'; ctx.beginPath(); ctx.moveTo(ship.x, ship.y - 14); ctx.lineTo(ship.x - 11, ship.y + 10); ctx.lineTo(ship.x + 11, ship.y + 10); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#c8372d'; ctx.fillRect(ship.x - 13, ship.y + 2, 5, 8); ctx.fillRect(ship.x + 8, ship.y + 2, 5, 8);
        ctx.fillStyle = '#3d8fd6'; ctx.fillRect(ship.x - 2, ship.y - 5, 4, 6);
        ctx.fillStyle = Math.random() > 0.5 ? '#ffb347' : '#ff6a3d'; ctx.fillRect(ship.x - 4, ship.y + 10, 3, 4 + Math.random() * 4); ctx.fillRect(ship.x + 1, ship.y + 10, 3, 4 + Math.random() * 4);
      }
      // HUD
      ctx.fillStyle = '#e4dfd2'; ctx.font = '14px "VT323", monospace';
      ctx.fillText(`SCORE ${sc}`, 10, 18); ctx.fillText(`WAVE ${wave}`, W / 2 - 24, 18); ctx.fillText(`LIVES ${'♥'.repeat(Math.max(0, lives))}`, W - 84, 18);

      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); clearTimeout(focusTimer); window.removeEventListener('keydown', onDown); window.removeEventListener('keyup', onUp); };
  }, [best]);

  return (
    <div className="app voidrunner" onPointerDown={() => canvasRef.current?.focus({ preventScroll: true })}>
      <canvas ref={canvasRef} width={W} height={H} className="vr-canvas" tabIndex={0} aria-label="VoidRunner game. Arrow keys move, space shoots." />
      {status !== 'playing' && (
        <div className="vr-overlay">
          <div className="vr-title">VOID<span>RUNNER</span></div>
          {status === 'over' && <div className="vr-sub">GAME OVER · score {score} · best {best}</div>}
          {status === 'ready' && <div className="vr-sub">Arrows / WASD to move · Space to shoot</div>}
          <div className="vr-hint">Press Space to {status === 'over' ? 'play again' : 'start'}</div>
          <div className="vr-credit">Homage to the Pygame original — <a href="https://github.com/ammarcodes29/VoidRunner" target="_blank" rel="noreferrer">source ↗</a></div>
        </div>
      )}
    </div>
  );
}
