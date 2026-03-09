'use client';
import { useMemo } from 'react';
import { JournalEntry } from '@/lib/types';
import { streak } from '@/lib/utils';

interface Props {
  entries: JournalEntry[];
}

function MoodChart({ moodLine }: { moodLine: JournalEntry[] }) {
  if (moodLine.length < 2) {
    return (
      <div className="empty-wrap" style={{ padding: 24 }}>
        <div className="empty-desc">Write a few more entries with mood tracking to see your trend.</div>
      </div>
    );
  }
  const W = 400, H = 100, P = 14;
  const xs = (i: number) => P + (i / (moodLine.length - 1)) * (W - P * 2);
  const ys = (s: number) => H - P - ((s - 1) / 9) * (H - P * 2);
  const pts = moodLine.map((e, i) => ({ x: xs(i), y: ys(e.moodScore) }));
  const path = pts.map((p, i) => {
    if (i === 0) return `M${p.x},${p.y}`;
    const prev = pts[i - 1];
    const mx = (p.x - prev.x) / 2;
    return `C${prev.x + mx},${prev.y} ${p.x - mx},${p.y} ${p.x},${p.y}`;
  }).join(' ');
  const area = path + ` L${pts[pts.length - 1].x},${H - P} L${P},${H - P} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
      <defs>
        <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--tint)" stopOpacity="0.12" />
          <stop offset="100%" stopColor="var(--tint)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[2, 5, 8].map(v => (
        <line key={v} x1={P} y1={ys(v)} x2={W - P} y2={ys(v)} stroke="var(--line)" strokeWidth="1" />
      ))}
      <path d={area} fill="url(#ag)" />
      <path d={path} fill="none" stroke="var(--tint)" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="var(--tint)" stroke="var(--bg-raised)" strokeWidth="1.5" />
      ))}
    </svg>
  );
}

export default function Analytics({ entries: es }: Props) {
  const totalWords = es.reduce((s, e) => s + (e.wordCount || 0), 0);
  const avgMood = es.filter(e => e.moodScore).length
    ? (es.reduce((s, e) => s + (e.moodScore || 0), 0) / es.filter(e => e.moodScore).length).toFixed(1)
    : '—';

  const weeks = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 8 }, (_, w) => {
      const start = new Date(now); start.setDate(now.getDate() - (7 - w) * 7 - 6);
      const end   = new Date(now); end.setDate(now.getDate() - (7 - w) * 7);
      const n = es.filter(e => { const d = new Date(e.date + 'T12:00'); return d >= start && d <= end; }).length;
      return { l: `W${w + 1}`, n, cur: w === 7 };
    });
  }, [es]);
  const maxW = Math.max(...weeks.map(w => w.n), 1);

  const moodLine = useMemo(
    () => [...es].filter(e => e.moodScore).sort((a, b) => a.date.localeCompare(b.date)).slice(-14),
    [es]
  );

  const moodDist = useMemo(() => {
    const c: Record<string, number> = {};
    es.forEach(e => { if (e.moodEmoji) c[e.moodEmoji] = (c[e.moodEmoji] || 0) + 1; });
    return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [es]);
  const maxMD = Math.max(...moodDist.map(d => d[1]), 1);

  const tagData = useMemo(() => {
    const c: Record<string, number> = {};
    es.forEach(e => (e.tags || []).forEach(t => { c[t] = (c[t] || 0) + 1; }));
    return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 12);
  }, [es]);

  return (
    <div className="page-rise">
      <div className="topbar">
        <div className="topbar-left">
          <span className="topbar-title">Insights</span>
          <span className="topbar-sep">·</span>
          <span className="topbar-sub">Your journaling story</span>
        </div>
      </div>

      <div className="page stagger">
        {/* Overview */}
        <div className="grid-3" style={{ marginBottom: 24 }}>
          {[
            { v: es.length, l: 'Entries' },
            { v: totalWords >= 1000 ? `${(totalWords / 1000).toFixed(1)}k` : (totalWords || '—'), l: 'Words' },
            { v: avgMood, l: 'Avg mood' },
          ].map(s => (
            <div key={s.l} className="stat">
              <div className="stat-val">{s.v}</div>
              <div className="stat-lbl">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Charts row 1 */}
        <div className="grid-2" style={{ marginBottom: 14 }}>
          <div className="surface surface-p">
            <div className="sec-row" style={{ marginBottom: 16 }}>
              <span className="sec-title">Mood over time</span>
              <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>{moodLine.length} points</span>
            </div>
            <MoodChart moodLine={moodLine} />
          </div>

          <div className="surface surface-p">
            <div className="sec-row" style={{ marginBottom: 18 }}>
              <span className="sec-title">Weekly writing</span>
              <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>8 weeks</span>
            </div>
            <div className="bars">
              {weeks.map((w, i) => (
                <div key={i} className="bar-col">
                  <div
                    className={`bar ${w.n > 0 ? 'has' : ''} ${w.cur ? 'cur' : ''}`}
                    style={{ height: `${(w.n / maxW) * 100}%` }}
                    title={`${w.l}: ${w.n}`}
                  />
                  <div className="bar-l">{w.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts row 2 */}
        <div className="grid-2">
          <div className="surface surface-p">
            <div className="sec-title" style={{ marginBottom: 18 }}>Mood distribution</div>
            {moodDist.length === 0 ? (
              <div className="empty-wrap" style={{ padding: 24 }}>
                <div className="empty-desc">Track your mood when writing to see patterns here.</div>
              </div>
            ) : moodDist.map(([emoji, n]) => (
              <div key={emoji} className="hbar">
                <span className="hbar-e">{emoji}</span>
                <div className="hbar-track">
                  <div className="hbar-fill" style={{ width: `${(n / maxMD) * 100}%` }} />
                </div>
                <span className="hbar-n">{n}</span>
              </div>
            ))}
          </div>

          <div className="surface surface-p">
            <div className="sec-title" style={{ marginBottom: 18 }}>Common themes</div>
            {tagData.length === 0 ? (
              <div className="empty-wrap" style={{ padding: 24 }}>
                <div className="empty-desc">Add tags to your entries to discover your themes.</div>
              </div>
            ) : (
              <div className="tcloud">
                {tagData.map(([t, n]) => (
                  <span
                    key={t}
                    className="tc-item"
                    style={{ fontSize: 11 + Math.min(n * 1.2, 5), padding: `${3 + Math.min(n, 3)}px ${9 + Math.min(n * 2, 7)}px` }}
                  >
                    {t} <span style={{ opacity: 0.4, fontSize: 10 }}>·{n}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
