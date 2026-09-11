import { useStore } from '../../state/store';

const ITEMS = [
  { name: 'portfolio-v1.html', size: '14 KB', note: 'It had a marquee tag. We do not talk about it.' },
  { name: 'portfolio-v2.tsx', size: '1.2 MB', note: 'Too many gradients, not enough sound effects.' },
  { name: 'bugs.txt', size: '0 KB', note: 'Empty. Suspiciously.' },
  { name: 'sleep_schedule.ics', size: '2 KB', note: 'Deleted during finals week, never restored.' },
  { name: 'todo.txt', size: '1 KB', note: '1. Get hired. 2. Rebuild this OS in Rust for no reason.' },
];

export default function Trash() {
  const showDialog = useStore((s) => s.showDialog);
  return (
    <div className="app trash">
      <div className="explorer-toolbar">
        <span className="explorer-path">Recycle Bin</span>
        <button type="button" className="btn btn-small" onClick={() => showDialog({ kind: 'error', title: 'Recycle Bin', message: 'Access denied: these are load-bearing memories.' })}>Empty Recycle Bin</button>
      </div>
      <table className="file-table">
        <thead><tr><th>Name</th><th>Size</th><th>Note</th></tr></thead>
        <tbody>
          {ITEMS.map((i) => <tr key={i.name}><td>{i.name}</td><td>{i.size}</td><td className="muted">{i.note}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}
