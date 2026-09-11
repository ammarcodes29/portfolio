# SpartanOS — Ammar Suleyman's portfolio

An interactive portfolio disguised as a late-90s workstation. You land on a
photograph of a desk. Press the power button on the tower. The CRT crackles
on, a BIOS runs its checks, the camera pushes into the monitor, and a fictional
operating system, **SpartanOS**, boots. Everything about me lives inside it as
draggable windows: README, Projects, Experience, Resume, Terminal, Navigator,
Contact, and a playable homage to my Pygame game, VoidRunner.

Inspired by the wonderful [moviepalaceonline.com](https://moviepalaceonline.com).

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static site in dist/
npm run preview    # serve the production build
npm test           # vitest: phase machine + window manager
npm run lint       # oxlint
```

Node 20+ recommended.

## How it works

| Piece | Where | Notes |
|---|---|---|
| Scene & zoom | `src/scene/Scene.tsx`, `sceneConfig.ts` | A fixed-size stage (image pixels) is translated/scaled to cover the viewport (off) or push into the CRT glass (on). Screen, LED, and power button are children positioned in image pixels, so they ride the zoom. |
| CRT glass | `src/scene/Screen.tsx`, `styles/scene.css` | Logical 1024×760 surface scaled into the glass; clip-path tube open/close, scanlines, RGB fringe, vignette, flicker, light spill onto the desk. |
| Boot | `src/boot/Boot.tsx` | BIOS lines with a memory count-up, POST beep, HDD chatter, then the SpartanOS splash. Any key or click skips it. |
| OS shell | `src/os/*` | Desktop icons, draggable/minimize/maximize windows, taskbar with live clock, start menu, dialogs. Windows are sheets on phones. |
| Apps | `src/os/apps/*` | README, Projects explorer, Experience, Resume (PDF), Contact, Navigator (bookmarks + live GitHub repo list), Terminal (`help`), VoidRunner (canvas game), Recycle Bin. |
| State | `src/state/store.ts` | Zustand phase machine `off → powering → booting → desktop → shutdown` and the window manager. Unit-tested. |
| Sound | `src/audio/sfx.ts`, `public/sfx/` | Web Audio, preloaded OGG Vorbis (m4a fallback). Mute is persisted. |
| Content | `src/data/portfolio.ts` | The only file you need to edit to update the portfolio. |

## Sound credits

- UI clicks, switches, window open/close, errors: [Kenney Interface Sounds](https://kenney.nl/assets/interface-sounds) (CC0).
- CRT power-on thump, power-off zap, POST beep, HDD seek, fan hum, startup and
  shutdown chimes, notification ding: synthesized with ffmpeg (`aevalsrc`,
  `sine`, `anoisesrc`) for this project.

## Deploy

`npm run build` produces a fully static `dist/` (relative asset paths, so it
works at the root of a domain or under a sub-path). Drop it on Vercel, Netlify,
Cloudflare Pages, or GitHub Pages.

## Updating content

- Text, links, projects, experience: `src/data/portfolio.ts`
- Resume PDF: replace `public/AmmarSuleyman-Resume.pdf`
- Scene photo: replace `public/scene/workstation.jpg` and re-measure the glass
  and power-button rectangles in `src/scene/sceneConfig.ts` (image pixels).
