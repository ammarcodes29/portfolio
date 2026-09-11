import type { ReactElement, SVGProps } from 'react';
import type { AppId } from '../state/store';

type P = SVGProps<SVGSVGElement>;
const base = (p: P): P => ({ viewBox: '0 0 32 32', shapeRendering: 'crispEdges', width: 32, height: 32, ...p });

/** Spartan helmet mark, used as the OS logo. */
export function SpartanLogo(p: P) {
  return (
    <svg {...base(p)} aria-hidden="true">
      <rect x="6" y="8" width="20" height="20" fill="#e5a823" />
      <rect x="8" y="6" width="16" height="2" fill="#e5a823" />
      <rect x="10" y="4" width="12" height="2" fill="#e5a823" />
      <rect x="4" y="12" width="2" height="12" fill="#e5a823" />
      <rect x="26" y="12" width="2" height="12" fill="#e5a823" />
      <rect x="12" y="2" width="8" height="2" fill="#0b2545" />
      <rect x="14" y="0" width="4" height="2" fill="#0b2545" />
      <rect x="15" y="4" width="2" height="6" fill="#0b2545" />
      <rect x="9" y="15" width="14" height="4" fill="#0b2545" />
      <rect x="12" y="19" width="2" height="7" fill="#0b2545" />
      <rect x="18" y="19" width="2" height="7" fill="#0b2545" />
      <rect x="14" y="21" width="4" height="7" fill="#0b2545" />
      <rect x="10" y="12" width="3" height="2" fill="#f6c65a" />
      <rect x="19" y="12" width="3" height="2" fill="#f6c65a" />
    </svg>
  );
}

function ReadmeIcon(p: P) {
  return (
    <svg {...base(p)} aria-hidden="true">
      <rect x="6" y="2" width="16" height="28" fill="#fbf8ef" />
      <rect x="20" y="2" width="2" height="8" fill="#b9b3a4" />
      <rect x="18" y="2" width="4" height="2" fill="#b9b3a4" />
      <rect x="22" y="8" width="4" height="22" fill="#fbf8ef" />
      <rect x="22" y="8" width="4" height="2" fill="#b9b3a4" />
      <rect x="9" y="12" width="14" height="2" fill="#0b2545" />
      <rect x="9" y="16" width="10" height="2" fill="#55504a" />
      <rect x="9" y="20" width="12" height="2" fill="#55504a" />
      <rect x="9" y="24" width="8" height="2" fill="#55504a" />
      <rect x="5" y="1" width="18" height="1" fill="#55504a" /><rect x="5" y="1" width="1" height="30" fill="#55504a" />
      <rect x="5" y="30" width="22" height="1" fill="#55504a" /><rect x="26" y="8" width="1" height="23" fill="#55504a" />
    </svg>
  );
}

function FolderIcon(p: P) {
  return (
    <svg {...base(p)} aria-hidden="true">
      <rect x="2" y="6" width="12" height="4" fill="#c7961b" />
      <rect x="2" y="9" width="28" height="19" fill="#e5a823" />
      <rect x="2" y="13" width="28" height="15" fill="#f6c65a" />
      <rect x="1" y="5" width="12" height="1" fill="#5a4308" /><rect x="1" y="5" width="1" height="24" fill="#5a4308" />
      <rect x="1" y="28" width="30" height="1" fill="#5a4308" /><rect x="30" y="8" width="1" height="21" fill="#5a4308" />
      <rect x="13" y="8" width="18" height="1" fill="#5a4308" />
      <rect x="5" y="17" width="10" height="2" fill="#0b2545" />
      <rect x="5" y="21" width="14" height="2" fill="#0b2545" />
    </svg>
  );
}

function BriefcaseIcon(p: P) {
  return (
    <svg {...base(p)} aria-hidden="true">
      <rect x="11" y="4" width="10" height="4" fill="#6b4a1c" />
      <rect x="13" y="6" width="6" height="2" fill="#3a2810" />
      <rect x="2" y="8" width="28" height="20" fill="#8f5f24" />
      <rect x="2" y="8" width="28" height="2" fill="#b47a32" />
      <rect x="2" y="16" width="28" height="2" fill="#5a3b14" />
      <rect x="13" y="15" width="6" height="4" fill="#e5a823" />
      <rect x="1" y="7" width="30" height="1" fill="#2a1a08" /><rect x="1" y="7" width="1" height="22" fill="#2a1a08" />
      <rect x="1" y="28" width="30" height="1" fill="#2a1a08" /><rect x="30" y="7" width="1" height="22" fill="#2a1a08" />
    </svg>
  );
}

function TerminalIcon(p: P) {
  return (
    <svg {...base(p)} aria-hidden="true">
      <rect x="1" y="3" width="30" height="24" fill="#d3cdbd" />
      <rect x="3" y="5" width="26" height="18" fill="#0a0e0b" />
      <rect x="6" y="9" width="2" height="2" fill="#9dffb0" /><rect x="8" y="11" width="2" height="2" fill="#9dffb0" /><rect x="6" y="13" width="2" height="2" fill="#9dffb0" />
      <rect x="12" y="13" width="8" height="2" fill="#9dffb0" />
      <rect x="6" y="18" width="2" height="2" fill="#9dffb0" />
      <rect x="10" y="27" width="12" height="2" fill="#8f887a" />
      <rect x="1" y="2" width="30" height="1" fill="#4a453d" /><rect x="0" y="3" width="1" height="24" fill="#4a453d" />
      <rect x="31" y="3" width="1" height="24" fill="#4a453d" /><rect x="1" y="27" width="30" height="1" fill="#4a453d" />
    </svg>
  );
}

function PdfIcon(p: P) {
  return (
    <svg {...base(p)} aria-hidden="true">
      <rect x="6" y="2" width="20" height="28" fill="#fbf8ef" />
      <rect x="6" y="12" width="20" height="8" fill="#c8372d" />
      <rect x="8" y="14" width="2" height="4" fill="#fff" /><rect x="10" y="14" width="2" height="2" fill="#fff" />
      <rect x="13" y="14" width="2" height="4" fill="#fff" /><rect x="15" y="14" width="2" height="4" fill="#fff" /><rect x="15" y="14" width="2" height="1" fill="#fff" />
      <rect x="19" y="14" width="2" height="4" fill="#fff" /><rect x="21" y="14" width="2" height="1" fill="#fff" /><rect x="21" y="16" width="1" height="1" fill="#fff" />
      <rect x="9" y="5" width="12" height="2" fill="#55504a" /><rect x="9" y="23" width="14" height="2" fill="#8f887a" /><rect x="9" y="26" width="10" height="2" fill="#8f887a" />
      <rect x="5" y="1" width="22" height="1" fill="#55504a" /><rect x="5" y="1" width="1" height="30" fill="#55504a" />
      <rect x="5" y="30" width="22" height="1" fill="#55504a" /><rect x="26" y="1" width="1" height="30" fill="#55504a" />
    </svg>
  );
}

function MailIcon(p: P) {
  return (
    <svg {...base(p)} aria-hidden="true">
      <rect x="2" y="7" width="28" height="19" fill="#fbf8ef" />
      <rect x="2" y="7" width="28" height="2" fill="#e5a823" />
      <rect x="4" y="9" width="4" height="2" fill="#b9b3a4" /><rect x="8" y="11" width="4" height="2" fill="#b9b3a4" />
      <rect x="12" y="13" width="4" height="2" fill="#b9b3a4" /><rect x="16" y="13" width="4" height="2" fill="#b9b3a4" />
      <rect x="20" y="11" width="4" height="2" fill="#b9b3a4" /><rect x="24" y="9" width="4" height="2" fill="#b9b3a4" />
      <rect x="14" y="15" width="4" height="2" fill="#0b2545" />
      <rect x="1" y="6" width="30" height="1" fill="#4a453d" /><rect x="1" y="6" width="1" height="21" fill="#4a453d" />
      <rect x="1" y="26" width="30" height="1" fill="#4a453d" /><rect x="30" y="6" width="1" height="21" fill="#4a453d" />
    </svg>
  );
}

function GlobeIcon(p: P) {
  return (
    <svg {...base(p)} aria-hidden="true">
      <rect x="10" y="2" width="12" height="2" fill="#0b2545" /><rect x="6" y="4" width="4" height="2" fill="#0b2545" /><rect x="22" y="4" width="4" height="2" fill="#0b2545" />
      <rect x="4" y="6" width="2" height="4" fill="#0b2545" /><rect x="26" y="6" width="2" height="4" fill="#0b2545" />
      <rect x="2" y="10" width="2" height="12" fill="#0b2545" /><rect x="28" y="10" width="2" height="12" fill="#0b2545" />
      <rect x="4" y="22" width="2" height="4" fill="#0b2545" /><rect x="26" y="22" width="2" height="4" fill="#0b2545" />
      <rect x="6" y="26" width="4" height="2" fill="#0b2545" /><rect x="22" y="26" width="4" height="2" fill="#0b2545" /><rect x="10" y="28" width="12" height="2" fill="#0b2545" />
      <rect x="6" y="6" width="20" height="20" fill="#3d8fd6" />
      <rect x="4" y="10" width="24" height="12" fill="#3d8fd6" />
      <rect x="8" y="8" width="6" height="6" fill="#57b96b" /><rect x="14" y="10" width="4" height="8" fill="#57b96b" />
      <rect x="18" y="14" width="6" height="6" fill="#57b96b" /><rect x="10" y="18" width="6" height="4" fill="#57b96b" />
      <rect x="20" y="8" width="4" height="4" fill="#57b96b" />
      <rect x="8" y="8" width="2" height="2" fill="#a8dbff" /><rect x="10" y="6" width="4" height="2" fill="#a8dbff" />
    </svg>
  );
}

function ShipIcon(p: P) {
  return (
    <svg {...base(p)} aria-hidden="true">
      <rect x="2" y="2" width="28" height="28" fill="#070914" />
      <rect x="5" y="5" width="1" height="1" fill="#fff" /><rect x="24" y="8" width="1" height="1" fill="#fff" /><rect x="8" y="22" width="1" height="1" fill="#fff" /><rect x="26" y="24" width="1" height="1" fill="#fff" />
      <rect x="15" y="6" width="2" height="4" fill="#9fb9de" />
      <rect x="13" y="10" width="6" height="8" fill="#e4dfd2" />
      <rect x="14" y="8" width="4" height="2" fill="#e4dfd2" />
      <rect x="9" y="14" width="4" height="6" fill="#c8372d" /><rect x="19" y="14" width="4" height="6" fill="#c8372d" />
      <rect x="11" y="18" width="10" height="3" fill="#8f887a" />
      <rect x="15" y="11" width="2" height="3" fill="#3d8fd6" />
      <rect x="13" y="21" width="2" height="3" fill="#ffb347" /><rect x="17" y="21" width="2" height="3" fill="#ffb347" />
      <rect x="14" y="24" width="1" height="3" fill="#ff6a3d" /><rect x="17" y="24" width="1" height="3" fill="#ff6a3d" />
      <rect x="1" y="1" width="30" height="1" fill="#4a453d" /><rect x="1" y="1" width="1" height="30" fill="#4a453d" />
      <rect x="1" y="30" width="30" height="1" fill="#4a453d" /><rect x="30" y="1" width="1" height="30" fill="#4a453d" />
    </svg>
  );
}

function TrashIcon(p: P) {
  return (
    <svg {...base(p)} aria-hidden="true">
      <rect x="12" y="3" width="8" height="3" fill="#8f887a" />
      <rect x="6" y="6" width="20" height="3" fill="#b9b3a4" />
      <rect x="8" y="9" width="16" height="20" fill="#d3cdbd" />
      <rect x="11" y="12" width="2" height="14" fill="#8f887a" /><rect x="15" y="12" width="2" height="14" fill="#8f887a" /><rect x="19" y="12" width="2" height="14" fill="#8f887a" />
      <rect x="5" y="5" width="22" height="1" fill="#4a453d" /><rect x="5" y="5" width="1" height="4" fill="#4a453d" /><rect x="26" y="5" width="1" height="4" fill="#4a453d" />
      <rect x="7" y="9" width="1" height="21" fill="#4a453d" /><rect x="24" y="9" width="1" height="21" fill="#4a453d" /><rect x="7" y="29" width="18" height="1" fill="#4a453d" />
    </svg>
  );
}

export const APP_ICONS: Record<AppId, (p: P) => ReactElement> = {
  about: ReadmeIcon,
  projects: FolderIcon,
  experience: BriefcaseIcon,
  terminal: TerminalIcon,
  resume: PdfIcon,
  contact: MailIcon,
  navigator: GlobeIcon,
  voidrunner: ShipIcon,
  trash: TrashIcon,
};

export function AppIcon({ id, size = 32, ...rest }: { id: AppId; size?: number } & P) {
  const Cmp = APP_ICONS[id];
  return <Cmp width={size} height={size} {...rest} />;
}

/** Generic file glyph for the explorer, by extension. */
export function FileGlyph({ name, size = 16 }: { name: string; size?: number }) {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  const color = ext === 'exe' ? '#0b2545' : ext === 'app' ? '#157f7f' : ext === 'py' ? '#3572a5' : ext === 'ipynb' ? '#e07a1f' : ext === 'cf' ? '#f38020' : ext === 'log' ? '#8f887a' : '#c8372d';
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} shapeRendering="crispEdges" aria-hidden="true">
      <rect x="3" y="1" width="9" height="14" fill="#fbf8ef" />
      <rect x="2" y="0" width="10" height="1" fill="#55504a" /><rect x="2" y="0" width="1" height="16" fill="#55504a" />
      <rect x="2" y="15" width="12" height="1" fill="#55504a" /><rect x="13" y="4" width="1" height="12" fill="#55504a" />
      <rect x="11" y="1" width="2" height="3" fill="#b9b3a4" />
      <rect x="5" y="8" width="6" height="4" fill={color} />
    </svg>
  );
}
