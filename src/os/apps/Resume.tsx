import { PROFILE } from '../../data/portfolio';
import { sfx } from '../../audio/sfx';

export default function Resume() {
  const url = `${import.meta.env.BASE_URL}${PROFILE.resumeUrl}`;
  return (
    <div className="app resume">
      <div className="explorer-toolbar">
        <span className="explorer-path">AmmarSuleyman-Resume.pdf</span>
        <span className="toolbar-actions">
          <a className="btn" href={url} target="_blank" rel="noreferrer" onClick={() => sfx.play('click', { volume: 0.5 })}>Open ↗</a>
          <a className="btn btn-primary" href={url} download="Ammar-Suleyman-Resume.pdf" onClick={() => sfx.play('confirm', { volume: 0.6 })}>Download</a>
        </span>
      </div>
      <object className="resume-frame" data={`${url}#toolbar=0&navpanes=0&view=FitH`} type="application/pdf" aria-label="Resume PDF">
        <div className="resume-fallback">
          <p>This browser cannot preview PDFs inline.</p>
          <a className="btn btn-primary" href={url} target="_blank" rel="noreferrer">Open the resume ↗</a>
        </div>
      </object>
    </div>
  );
}
