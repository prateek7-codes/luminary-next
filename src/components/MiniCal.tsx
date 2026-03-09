'use client';
import { JournalEntry, Page } from '@/lib/types';
import { tod } from '@/lib/utils';

interface Props {
  entries: JournalEntry[];
  setPage: (p: Page) => void;
}

const MN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function MiniCal({ entries, setPage }: Props) {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const firstDay = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const hasDates = new Set(entries.map(e => e.date));
  const tdStr = tod();

  return (
    <div className="surface surface-p">
      <div className="sec-row" style={{ marginBottom: 12 }}>
        <span className="sec-title">{MN[m]} {y}</span>
        <button className="sec-action" onClick={() => setPage('calendar')}>Full →</button>
      </div>
      <div className="day-names">
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <div key={i} className="day-name">{d}</div>
        ))}
      </div>
      <div className="cal-grid">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`e${i}`} className="cal-cell empty" />
        ))}
        {Array.from({ length: days }).map((_, i) => {
          const day = i + 1;
          const ds = `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          return (
            <div
              key={day}
              className={`cal-cell ${ds === tdStr ? 'today' : ''} ${hasDates.has(ds) && ds !== tdStr ? 'has-entry' : ''}`}
              style={{ fontSize: 12 }}
              onClick={() => setPage('calendar')}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
