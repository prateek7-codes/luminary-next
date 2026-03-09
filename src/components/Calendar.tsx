'use client';
import { useState, useMemo } from 'react';
import { JournalEntry, Page } from '@/lib/types';
import { tod, fmtMed } from '@/lib/utils';
import EntryCard from './EntryCard';

interface Props {
  entries: JournalEntry[];
  setPage: (p: Page) => void;
  setEdit: (e: JournalEntry | null) => void;
}

const MN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DN = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function Calendar({ entries: es, setPage, setEdit }: Props) {
  const [cur, setCur] = useState(new Date());
  const [sel, setSel] = useState<string | null>(null);

  const y = cur.getFullYear();
  const m = cur.getMonth();
  const firstDay = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const td = tod();

  const eMap = useMemo(() => {
    const mp: Record<string, JournalEntry[]> = {};
    es.forEach(e => {
      if (!mp[e.date]) mp[e.date] = [];
      mp[e.date].push(e);
    });
    return mp;
  }, [es]);

  const ds = (d: number) =>
    `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const monthPrefix = `${y}-${String(m + 1).padStart(2, '0')}`;
  const monthEs = es.filter(e => e.date.startsWith(monthPrefix));

  return (
    <div className="page-rise">
      <div className="topbar">
        <div className="topbar-left">
          <span className="topbar-title">Calendar</span>
          <span className="topbar-sep">·</span>
          <span className="topbar-sub">{MN[m]} {y}</span>
        </div>
        <div className="topbar-right">
          <button className="btn btn-ghost btn-sm" onClick={() => setCur(new Date(y, m - 1))}>←</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setCur(new Date())}>Today</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setCur(new Date(y, m + 1))}>→</button>
        </div>
      </div>

      <div className="page">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>
          {/* Calendar grid */}
          <div>
            <div className="surface surface-p">
              <div className="cal-header-row">
                <span className="cal-month">{MN[m]} {y}</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setCur(new Date(y, m - 1))}>←</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setCur(new Date(y, m + 1))}>→</button>
                </div>
              </div>

              <div className="day-names">
                {DN.map(d => <div key={d} className="day-name">{d}</div>)}
              </div>

              <div className="cal-grid">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`e${i}`} className="cal-cell empty" />
                ))}
                {Array.from({ length: days }).map((_, i) => {
                  const day = i + 1;
                  const str = ds(day);
                  return (
                    <div
                      key={day}
                      className={[
                        'cal-cell',
                        str === td ? 'today' : '',
                        eMap[str] && str !== td ? 'has-entry' : '',
                        sel === str && str !== td ? 'sel' : '',
                      ].filter(Boolean).join(' ')}
                      onClick={() => setSel(sel === str ? null : str)}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>

              <hr className="divider" style={{ margin: '20px 0 16px' }} />

              {/* Month stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, textAlign: 'center' }}>
                {[
                  { l: 'Entries', v: monthEs.length },
                  { l: 'Words', v: monthEs.reduce((s, e) => s + (e.wordCount || 0), 0).toLocaleString() },
                  { l: 'Avg mood', v: monthEs.filter(e => e.moodScore).length
                      ? (monthEs.reduce((s, e) => s + (e.moodScore || 0), 0) / monthEs.filter(e => e.moodScore).length).toFixed(1)
                      : '—' },
                  { l: 'Active days', v: new Set(monthEs.map(e => e.date)).size },
                ].map(s => (
                  <div key={s.l}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: 'var(--ink)' }}>{s.v}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selected day panel */}
          <div>
            {sel ? (
              <div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 17, color: 'var(--ink)', marginBottom: 14, fontStyle: 'italic' }}>
                  {fmtMed(sel)}
                </div>
                {(eMap[sel] || []).length > 0 ? (
                  <div className="stagger">
                    {(eMap[sel] || []).map(e => (
                      <EntryCard key={e.id} entry={e} onClick={() => { setEdit(e); setPage('editor'); }} />
                    ))}
                  </div>
                ) : (
                  <div className="surface">
                    <div className="empty-wrap" style={{ padding: '36px 20px' }}>
                      <div className="empty-glyph" style={{ fontSize: 28 }}>○</div>
                      <div className="empty-title" style={{ fontSize: 16 }}>No entry</div>
                      {sel === td && (
                        <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => { setEdit(null); setPage('editor'); }}>
                          Write now
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="surface">
                <div className="empty-wrap" style={{ padding: '48px 20px' }}>
                  <div className="empty-glyph" style={{ fontSize: 32 }}>□</div>
                  <div className="empty-title" style={{ fontSize: 16 }}>Select a date</div>
                  <div className="empty-desc">Click a day to see its entries.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
