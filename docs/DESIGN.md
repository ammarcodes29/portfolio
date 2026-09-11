# SpartanOS — Design Spec (2026-09-10)

Interactive portfolio for Ammar Suleyman, inspired by moviepalaceonline.com.
You land on a photoreal 90s workstation. Press the tower's power button. The CRT
crackles on, a BIOS runs, the camera pushes into the monitor, and a fictional OS
("SpartanOS" by "Suleyman Systems") boots. Everything about Ammar lives inside
that OS as draggable windows.

## Goals
- Memorable first impression; still fast to navigate for a recruiter.
- Real sound design (OGG files, Web Audio), tasteful and mutable.
- Accurate content from the Fall 2026 resume + live GitHub links.
- Works on mobile (the phone *is* the screen) and respects reduced motion.

## Non-goals
- No backend, no analytics, no CMS. Content is one TypeScript file.
- No 3D/WebGL. The scene is a still image + DOM layers + CSS transforms.

## Reference findings (moviepalaceonline.com)
- Scene is a fixed 3506×1972 wrapper scaled with `--appScale = max(vw/W, vh/H)`
  (cover). "Zoom in" = same wrapper, larger scale + translate to center the screen.
- The OS renders *inside* an 800×600 div positioned over the CRT glass at all
  times; zoom simply scales it up. Bezel stays visible when zoomed in.
- CRT on: clip-path grows from a dot → horizontal line → full rect (0.5s).
  CRT off: rect → line → dot, plus a white flash line and a glow.
- Overlays: scanline video at 20% opacity, RGB-fringe image at 40% (screen blend),
  1–2s micro-jitter keyframes.

## Architecture (Vite + React 19 + TypeScript + Zustand, custom CSS)
```
src/
  data/portfolio.ts       content: profile, projects, experience, education, skills
  state/store.ts          phase machine + window manager
  audio/sfx.ts            Web Audio manager (preload OGG, m4a fallback, mute, loop)
  scene/Scene.tsx         stage wrapper, background image, glow, power button, note
  scene/Screen.tsx        the CRT glass: boot or desktop content + CRT overlays
  boot/Boot.tsx           BIOS/POST text, memory count, splash + progress
  os/Desktop.tsx          wallpaper, icons, taskbar, start menu
  os/Window.tsx           draggable window chrome (focus, min, max, close)
  os/apps/*.tsx           About, Projects, Experience, Terminal, Resume, Contact,
                          Navigator (links), VoidRunner (canvas mini-game)
```

### Phase machine
`off → powering (0.6s) → booting (~4s, skippable) → desktop → shutdown (1.6s) → off`
- `powering`: power click + CRT-on sound, LED turns green, screen clip-path opens,
  glow spills onto the desk, camera begins zooming.
- `booting`: BIOS text streams inside the screen while zoom completes; POST beep,
  HDD chatter; then SpartanOS splash + chime.
- `desktop`: OS interactive. Taskbar "Start → Shut Down" or the physical power
  button triggers `shutdown`.
- `shutdown`: windows close, shutdown chime, CRT collapse to a line, zoom out, LED red.

### Scene math
Scene image native size W×H. Wrapper is W×H px, `transform: translate(...) scale(s)`.
- Zoomed out: `s = max(vw/W, vh/H)`, centered (with a small vertical bias so the
  monitor sits in the upper-middle of the frame).
- Zoomed in: `s = min(vw/(screenW*1.08), vh/(screenH*1.08))` and translate so the
  screen center lands on the viewport center.
- Screen rect and power-button rect are measured in image pixels and stored as
  constants; the OS container is `SCREEN_W × SCREEN_H` logical px (1024×768)
  scaled to fit the glass rect.

### Mobile (< 760px wide or portrait)
Scene still plays (cover-cropped, monitor centered, a visible POWER pill appears
below the desk). After boot, the OS switches to `full` mode: it fills the
viewport at 1:1 instead of living inside the glass; windows become full-screen
sheets; taskbar stays.

### Sound (all OGG, CC0 Kenney + ffmpeg-synthesized; m4a fallback)
| event | file |
|---|---|
| power button | power_click (Kenney switch) + crt_on (synth degauss thump + hum) |
| POST | post_beep, hdd_seek |
| ambient while on | fan_loop (very low, loops) |
| OS splash | chime_up |
| icon select / open | select / open |
| window close / min / max | close / minimize / maximize |
| generic click, hover tick | click, tick |
| terminal keystrokes | key |
| error dialog | error ; confirm ; ding (notifications) |
| shutdown | chime_down, crt_off |
AudioContext resumes on the first user gesture (the power click). Mute toggle in
the taskbar tray, persisted in localStorage. Reduced-motion users keep sound.

### Visual system
- Fonts: VT323 (BIOS/terminal), Pixelify Sans (OS chrome), IBM Plex Mono (body).
- OS palette: cream chrome `#e8e4d8`, navy title `#0b2545 → #1b4a8a`, gold accent
  `#e5a823` (SJSU nod), teal wallpaper gradient with dithering; hard 2px borders,
  offset shadows; 1px pixel-perfect bevels.
- CRT: scanlines, subtle RGB fringe, vignette, faint flicker, bezel reflection.

### Content (from resume, Sept 2026)
About, Experience (Axon SWE intern 2026, Apple Product Specialist 2023–26,
Headstarter fellow 2024), Projects (elafate.com, SignConnect, VoidRunner,
cf_ai_syllabus_agent, GPU Triage Copilot, SalesVision AI, MindSync, cryptoAPI,
AI-Chatbot) each with GitHub/live links, Education (SJSU B.S. CS, May 2027),
Skills, Contact (email, LinkedIn, GitHub), Resume (PDF viewer + download).
Terminal supports: help, whoami, ls, cat <file>, open <app>, projects, contact,
clear, neofetch, sudo hire (easter egg), exit/shutdown.

### Accessibility & robustness
- Power button and icons are real `<button>`s; Esc closes focused window; any key
  skips boot; visible focus rings; `prefers-reduced-motion` shortens transitions.
- Store logic unit-tested with Vitest (phase transitions, window z-order, min/max).
- Browser-verified via the in-app preview at desktop and mobile widths.

### Deploy
Static build (`npm run build` → `dist/`). Vercel/GitHub Pages ready; README documents it.
