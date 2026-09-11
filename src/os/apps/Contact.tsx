import { useState } from 'react';
import { PROFILE } from '../../data/portfolio';
import { sfx } from '../../audio/sfx';

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true); sfx.play('confirm', { volume: 0.6 });
      setTimeout(() => setCopied(false), 1800);
    } catch { sfx.play('error', { volume: 0.5 }); }
  };
  return (
    <div className="app contact">
      <p className="lede">I am open to new-grad software engineering roles for 2027 and interesting conversations before then.</p>
      <dl className="contact-list">
        <dt>Email</dt>
        <dd>
          <a href={`mailto:${PROFILE.email}`} onClick={() => sfx.play('click', { volume: 0.5 })}>{PROFILE.email}</a>
          <button type="button" className="btn btn-small" onClick={copy}>{copied ? 'Copied ✓' : 'Copy'}</button>
        </dd>
        <dt>LinkedIn</dt>
        <dd><a href={PROFILE.linkedin} target="_blank" rel="noreferrer">linkedin.com/in/ammar-suleyman ↗</a></dd>
        <dt>GitHub</dt>
        <dd><a href={PROFILE.github} target="_blank" rel="noreferrer">github.com/{PROFILE.handle} ↗</a></dd>
        <dt>Location</dt>
        <dd>{PROFILE.location} · open to Seattle, the Bay Area, and remote</dd>
      </dl>
      <a className="btn btn-primary" href={`mailto:${PROFILE.email}?subject=Hi%20Ammar`} onClick={() => sfx.play('open', { volume: 0.6 })}>Write me an email</a>
    </div>
  );
}
