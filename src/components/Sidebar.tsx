'use client';
import { NAV } from '@/lib/constants';
import { streak } from '@/lib/utils';
import { JournalEntry, Page } from '@/lib/types';

interface Props {
  page: Page;
  setPage: (p: Page) => void;
  dark: boolean;
  setDark: (fn: (d: boolean) => boolean) => void;
  entries: JournalEntry[];
}

export default function Sidebar({ page, setPage, dark, setDark, entries }: Props) {
  const s = streak(entries);

  return (
    <nav className="sidebar">
      <div className="sidebar-top">
        <div className="wordmark" onClick={() => setPage('dashboard')}>
          <div className="wordmark-glyph">L</div>
          <span className="wordmark-name">Luminary</span>
        </div>
      </div>

      <div className="sidebar-nav">
        {NAV.map(n => (
          <button
            key={n.id}
            className={`nav-item ${page === n.id ? 'active' : ''}`}
            onClick={() => setPage(n.id as Page)}
          >
            <span style={{ fontSize: 12, opacity: 0.6, width: 14, flexShrink: 0 }}>{n.icon}</span>
            {n.label}
            {n.id === 'entries' && entries.length > 0 && (
              <span className="nav-count">{entries.length}</span>
            )}
            <div className="nav-dot" />
          </button>
        ))}
      </div>

      <div className="sidebar-bottom">
        {s > 0 && (
          <div className="streak-row">
            <span style={{ fontSize: 13 }}>🔥</span>
            <span>
              <span className="streak-num">{s}</span> day streak
            </span>
          </div>
        )}
        <button className="new-entry-btn" onClick={() => setPage('editor')}>
          <span style={{ fontSize: 14 }}>+</span>
          New Entry
          <span className="new-entry-shortcut">⌘N</span>
        </button>
        <button className="theme-btn" onClick={() => setDark(d => !d)}>
          <span>{dark ? 'Light mode' : 'Dark mode'}</span>
          <div className={`pill ${dark ? 'on' : ''}`}>
            <div className="pill-thumb" />
          </div>
        </button>
      </div>
    </nav>
  );
}
