import { EXPERIENCE, EDUCATION } from '../../data/portfolio';

export default function Experience() {
  return (
    <div className="app timeline">
      {EXPERIENCE.map((e) => (
        <section key={e.company + e.period} className="job">
          <header className="job-head">
            <div>
              <h1>{e.role}</h1>
              <div className="job-org">{e.company} · {e.location}</div>
            </div>
            <div className="job-period">{e.period}</div>
          </header>
          <ul className="bullets">
            {e.bullets.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
          {e.stack && <div className="chips">{e.stack.map((s) => <span key={s} className="chip">{s}</span>)}</div>}
        </section>
      ))}
      <section className="job">
        <header className="job-head">
          <div>
            <h1>{EDUCATION.degree}</h1>
            <div className="job-org">{EDUCATION.school} · {EDUCATION.location}</div>
          </div>
          <div className="job-period">{EDUCATION.period}</div>
        </header>
        <div className="chips">{EDUCATION.coursework.map((s) => <span key={s} className="chip">{s}</span>)}</div>
      </section>
    </div>
  );
}
