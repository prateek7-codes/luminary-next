'use client';
import { useMemo } from 'react';
import { JournalEntry, Page } from '@/lib/types';
import { QUOTES, PROMPTS, MOODS, MLABELS } from '@/lib/constants';
import { tod, streak, greet, fmtShort } from '@/lib/utils';
import EntryCard from './EntryCard';
import MiniCal from './MiniCal';
import Sparkline from './Sparkline';

interface Props {
  entries: JournalEntry[];
  setPage: (p: Page) => void;
  setEdit: (e: JournalEntry | null) => void;
}

export default function Dashboard({ entries: es, setPage, setEdit }: Props) {
  const quote  = useMemo(() => QUOTES[new Date().getDay() % QUOTES.length], []);
  const prompt = useMemo(() => PROMPTS[new Date().getDate() % PROMPTS.length], []);
  const todayE = es.find(e => e.date === tod());
  const totalWords = es.reduce((s, e) => s + (e.wordCount || 0), 0);
  const str = streak(es);
  const avgMood = es.filter(e => e.moodScore).length
    ? (es.reduce((s, e) => s + (e.moodScore || 0), 0) / es.filter(e => e.moodScore).length).toFixed(1)
    : '—';

  const heatmap = useMemo(() => {
    const map: Record<string, number> = {};
    es.forEach(e => { map[e.date] = (map[e.date] || 0) + 1; });
    const t = new Date();
    const cells: { ds: string; l: number }[] = [];
    for (let i = 363; i >= 0; i--) {
      const d = new Date(t);
      d.setDate(t.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      cells.push({ ds, l: Math.min(map[ds] || 0, 4) });
    }
    return cells;
  }, [es]);

  const recent = useMemo(
    () => [...es].sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? '')).slice(0, 6),
    [es]
  );

  const thisMonth = es.filter(e =>
    e.date.startsWith(new Date().toISOString().slice(0, 7))
  ).length;

  return (
    <div className="page-rise">
      <div className="topbar">
        <div className="topbar-left">
          <span className="topbar-title">{greet()}</span>
          <span className="topbar-sep">·</span>
          <span className="topbar-sub">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
        </div>
        <div className="topbar-right">
          <button className="btn btn-primary btn-sm" onClick={() => { setEdit(null); setPage('editor'); }}>
            + New Entry
          </button>
        </div>
      </div>

      <div className="page stagger">
        {/* Hero */}
        <div className="hero">
          <div className="hero-date">{greet()}</div>
          <div className="hero-heading">
            {todayE ? (
              <><em>&ldquo;{todayE.title || "today's entry"}&rdquo;</em> — continue writing</>
            ) : (
              <>What&rsquo;s on <em>your mind</em> today?</>
            )}
          </div>
          <div className="hero-quote">&ldquo;{quote.q}&rdquo; — {quote.a}</div>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => { setEdit(null); setPage('editor'); }}>
              {todayE ? 'Continue writing' : 'Start writing'}
            </button>
            <button className="btn btn-secondary" onClick={() => setPage('entries')}>All entries</button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats">
          {[
            { v: str || '—',  l: 'Day streak',    s: str > 0 ? 'Keep going' : 'Start today' },
            { v: es.length,   l: 'Total entries', s: `${thisMonth} this month` },
            { v: totalWords >= 1000 ? `${(totalWords / 1000).toFixed(1)}k` : (totalWords || '—'), l: 'Words written', s: 'across all entries' },
            { v: avgMood,     l: 'Average mood',  s: 'out of 10' },
          ].map(s => (
            <div key={s.l} className="stat">
              <div className="stat-val">{s.v}</div>
              <div className="stat-lbl">{s.l}</div>
              <div className="stat-sub">{s.s}</div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="dash-cols">
          <div className="dash-main">
            {/* Prompt */}
            <div className="prompt-block" onClick={() => { setEdit(null); setPage('editor'); }}>
              <div className="prompt-label">Today&rsquo;s prompt</div>
              <div className="prompt-q">{prompt}</div>
            </div>

            {/* Heatmap */}
            <div className="surface surface-p">
              <div className="sec-row">
                <span className="sec-title">Writing activity</span>
                <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>Past year</span>
              </div>
              <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
                <div className="heatmap">
                  {heatmap.map((c, i) => (
                    <div
                      key={i}
                      className="hm"
                      data-l={c.l}
                      title={`${c.ds}: ${c.l} entr${c.l !== 1 ? 'ies' : 'y'}`}
                    />
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 8, justifyContent: 'flex-end', fontSize: 10.5, color: 'var(--ink-4)' }}>
                <span>Less</span>
                {[0, 1, 2, 3, 4].map(l => (
                  <div key={l} className="hm" style={{ width: 9, height: 9, flex: 'none' }} data-l={l} />
                ))}
                <span>More</span>
              </div>
            </div>

            {/* Recent entries */}
            <div>
              <div className="sec-row">
                <span className="sec-title">Recent entries</span>
                <button className="sec-action" onClick={() => setPage('entries')}>View all →</button>
              </div>
              {recent.length === 0 ? (
                <div className="surface">
                  <div className="empty-wrap">
                    <div className="empty-glyph">◎</div>
                    <div className="empty-title">Nothing yet</div>
                    <div className="empty-desc">Your first entry is waiting to be written.</div>
                    <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => { setEdit(null); setPage('editor'); }}>
                      Write now
                    </button>
                  </div>
                </div>
              ) : (
                <div className="masonry">
                  {recent.map(e => (
                    <EntryCard key={e.id} entry={e} onClick={() => { setEdit(e); setPage('editor'); }} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Aside */}
          <div className="dash-aside">
            <MiniCal entries={es} setPage={setPage} />
            {streak(es) > 0 && <Sparkline entries={es} />}
            {/* Quick mood launcher */}
            <div className="surface surface-p">
              <div className="sec-row" style={{ marginBottom: 12 }}>
                <span className="sec-title">How are you feeling?</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 4 }}>
                {MOODS.map(m => (
                  <div
                    key={m}
                    title={MLABELS[m]}
                    style={{
                      aspectRatio: '1', borderRadius: 'var(--r-sm)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18, cursor: 'pointer', background: 'var(--bg-sunken)',
                      border: '1px solid var(--line)', transition: 'all var(--t-fast)',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--line-mid)';
                      (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--line)';
                      (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
                    }}
                    onClick={() => { setEdit(null); setPage('editor'); }}
                  >
                    {m}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
