'use client';
import { useMemo } from 'react';
import { JournalEntry } from '@/lib/types';

interface Props {
  entries: JournalEntry[];
}

export default function Sparkline({ entries }: Props) {
  const pts = useMemo(
    () =>
      [...entries]
        .filter(e => e.moodScore)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-10),
    [entries]
  );

  if (pts.length < 2) return null;

  const W = 260, H = 56, P = 8;
  const xs = (i: number) => P + (i / (pts.length - 1)) * (W - P * 2);
  const ys = (s: number) => H - P - ((s - 1) / 9) * (H - P * 2);
  const coordPts = pts.map((p, i) => ({ x: xs(i), y: ys(p.moodScore) }));

  const path = coordPts
    .map((p, i) => {
      if (i === 0) return `M${p.x},${p.y}`;
      const prev = coordPts[i - 1];
      const mx = (p.x - prev.x) / 2;
      return `C${prev.x + mx},${prev.y} ${p.x - mx},${p.y} ${p.x},${p.y}`;
    })
    .join(' ');

  const area =
    path +
    ` L${coordPts[coordPts.length - 1].x},${H - P} L${P},${H - P} Z`;

  return (
    <div className="surface surface-p">
      <div className="sec-row" style={{ marginBottom: 14 }}>
        <span className="sec-title">Mood trend</span>
        <span className="sec-action" style={{ cursor: 'default' }}>{pts.length} entries</span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="sparkline-wrap"
        style={{ width: '100%', height: 'auto', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--tint)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--tint)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[3, 5, 7, 9].map(v => (
          <line key={v} x1={P} y1={ys(v)} x2={W - P} y2={ys(v)} stroke="var(--line)" strokeWidth="1" />
        ))}
        <path d={area} fill="url(#sg)" />
        <path d={path} fill="none" stroke="var(--tint)" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        {coordPts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="var(--tint)" stroke="var(--bg-raised)" strokeWidth="1.5" />
        ))}
      </svg>
    </div>
  );
}
