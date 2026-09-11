import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useStore, type AppId } from '../../state/store';
import { sfx } from '../../audio/sfx';
import { PROFILE, PROJECTS, SKILLS, EXPERIENCE, OS } from '../../data/portfolio';

interface Row { kind: 'in' | 'out' | 'err'; text: string }

const APPS: AppId[] = ['about', 'projects', 'experience', 'terminal', 'resume', 'contact', 'navigator', 'voidrunner', 'trash'];

const HELP = `Available commands:
  help            show this list
  whoami          who owns this machine
  ls              list files
  cat <file>      print a file (try README.txt)
  projects        list projects with links
  skills          what I work with
  experience      where I have worked
  open <app>      open a window (${APPS.join(', ')})
  neofetch        system information
  contact         how to reach me
  clear           clear the screen
  shutdown        power off the machine`;

const NEOFETCH = `      ▄▄▄▄▄▄▄▄        ammar@spartan-os
    ▄█▀      ▀█▄      ----------------
   ██  ▄▀▀▀▀▄  ██     OS: ${OS.name} ${OS.version} (${OS.vendor})
   ██  █    █  ██     Host: ${OS.model}
   ██  ▀▄▄▄▄▀  ██     Kernel: react-19 / zustand
   ██          ██     Shell: sh.tsx
    ▀█▄▄▄▄▄▄▄▄█▀      Resolution: 1024x760 @ CRT
      ▀▀    ▀▀        Audio: OGG Vorbis (Web Audio)
                      CPU: Spartan Core @ 3.3 GHz
                      Memory: 65536K / 65536K
                      Uptime: since you pressed the button`;

export default function Terminal() {
  const openApp = useStore((s) => s.openApp);
  const shutdown = useStore((s) => s.shutdown);
  const [rows, setRows] = useState<Row[]>([
    { kind: 'out', text: `${OS.name} ${OS.version} — type "help" to get started.` },
  ]);
  const [input, setInput] = useState('');
  const [hist, setHist] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastKey = useRef(0);

  useEffect(() => { bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight }); }, [rows]);
  useEffect(() => { inputRef.current?.focus({ preventScroll: true }); }, []);

  const out = (text: string, kind: Row['kind'] = 'out') => setRows((r) => [...r, { kind, text }]);

  const run = (raw: string) => {
    const line = raw.trim();
    setRows((r) => [...r, { kind: 'in', text: line }]);
    if (!line) return;
    setHist((h) => [line, ...h].slice(0, 50)); setHi(-1);
    const [cmd, ...args] = line.split(/\s+/);
    const arg = args.join(' ');
    switch (cmd.toLowerCase()) {
      case 'help': out(HELP); break;
      case 'whoami': out(`${PROFILE.name} — ${PROFILE.title}\n${PROFILE.tagline}`); break;
      case 'ls': out('README.txt   Projects/   Experience/   Resume.pdf   Contact   Navigator   VoidRunner.exe'); break;
      case 'pwd': out('C:\\AMMAR'); break;
      case 'cat':
        if (/readme/i.test(arg)) out(PROFILE.bio.join('\n\n'));
        else if (/resume/i.test(arg)) { out('Resume.pdf is a binary file. Opening it for you…'); openApp('resume'); sfx.play('open', { volume: 0.6 }); }
        else out(`cat: ${arg || '<file>'}: No such file`, 'err');
        break;
      case 'projects':
        out(PROJECTS.map((p) => `${p.name.padEnd(20)} ${p.blurb}\n${' '.repeat(20)} ${p.live ?? p.repo ?? ''}`).join('\n'));
        break;
      case 'skills':
        out(Object.entries(SKILLS).map(([g, s]) => `${g}:\n  ${s.join(', ')}`).join('\n'));
        break;
      case 'experience':
        out(EXPERIENCE.map((e) => `${e.period.padEnd(22)} ${e.role} @ ${e.company}`).join('\n'));
        break;
      case 'contact':
        out(`email    ${PROFILE.email}\nlinkedin ${PROFILE.linkedin}\ngithub   ${PROFILE.github}`);
        break;
      case 'open': {
        const id = arg.toLowerCase().replace(/\.(txt|pdf|exe)$/, '') as AppId;
        const map: Record<string, AppId> = { readme: 'about', me: 'about', bin: 'trash', game: 'voidrunner', browser: 'navigator', mail: 'contact' };
        const target = APPS.includes(id) ? id : map[id];
        if (target) { openApp(target); sfx.play('open', { volume: 0.6 }); out(`Opening ${target}…`); }
        else { out(`open: unknown app "${arg}". Try: ${APPS.join(', ')}`, 'err'); sfx.play('error', { volume: 0.35 }); }
        break;
      }
      case 'neofetch': out(NEOFETCH); break;
      case 'clear': setRows([]); break;
      case 'sudo':
        if (/hire/i.test(arg)) { out('[sudo] password for recruiter: ********\nPermission granted. Drafting offer letter… ✓'); sfx.play('ding', { volume: 0.7 }); }
        else out(`${PROFILE.name.split(' ')[0]} is not in the sudoers file. This incident will be reported.`, 'err');
        break;
      case 'rm': out('rm: refusing to delete anything on a portfolio. Nice try.', 'err'); sfx.play('error', { volume: 0.35 }); break;
      case 'exit': case 'shutdown': case 'poweroff': out('Shutting down…'); setTimeout(shutdown, 400); break;
      case 'echo': out(arg); break;
      case 'date': out(new Date().toString()); break;
      default: out(`${cmd}: command not found. Type "help".`, 'err'); sfx.play('error', { volume: 0.3 });
    }
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { run(input); setInput(''); sfx.play('key', { volume: 0.5, rate: 0.9 }); return; }
    if (e.key === 'ArrowUp') { e.preventDefault(); const n = Math.min(hist.length - 1, hi + 1); if (n >= 0) { setHi(n); setInput(hist[n]); } return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); const n = hi - 1; setHi(n); setInput(n >= 0 ? hist[n] : ''); return; }
    if (e.key === 'Tab') {
      e.preventDefault();
      const cands = ['help', 'whoami', 'ls', 'cat README.txt', 'projects', 'skills', 'experience', 'open ', 'neofetch', 'contact', 'clear', 'shutdown'];
      const m = cands.find((c) => c.startsWith(input) && c !== input);
      if (m) setInput(m);
      return;
    }
    if (e.key.length === 1 && performance.now() - lastKey.current > 45) {
      lastKey.current = performance.now();
      sfx.play('key', { volume: 0.35, rate: 0.95 + Math.random() * 0.15 });
    }
  };

  return (
    <div className="app terminal" onClick={() => inputRef.current?.focus({ preventScroll: true })}>
      <div className="terminal-body" ref={bodyRef}>
        {rows.map((r, i) => (
          <div key={i} className={`t-row t-${r.kind}`}>{r.kind === 'in' ? <><span className="t-prompt">ammar@spartan-os:~$</span> {r.text}</> : r.text}</div>
        ))}
        <div className="t-row t-input">
          <span className="t-prompt">ammar@spartan-os:~$</span>
          <input
            ref={inputRef}
            className="t-field"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            aria-label="Terminal input"
          />
        </div>
      </div>
    </div>
  );
}
