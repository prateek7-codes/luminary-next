'use client';
import { useState, useMemo } from 'react';
import { JournalEntry, Page } from '@/lib/types';
import { MOODS, MLABELS } from '@/lib/constants';
import EntryCard from './EntryCard';

interface Props {
  entries: JournalEntry[];
  setPage: (p: Page) => void;
  setEdit: (e: JournalEntry | null) => void;
}

export default function Entries({ entries: es, setPage, setEdit }: Props) {
  const [q, setQ]       = useState('');
  const [mood, setMood] = useState('');
  const [tag, setTag]   = useState('');
  const [sort, setSort] = useState('newest');

  const tags = useMemo(() => [...new Set(es.flatMap(e => e.tags || []))], [es]);

  const list = useMemo(() => {
    let a = [...es];
    if (q)    a = a.filter(e => (e.title + ' ' + e.content).toLowerCase().includes(q.toLowerCase()));
    if (mood) a = a.filter(e => e.moodEmoji === mood);
    if (tag)  a = a.filter(e => e.tags?.includes(tag));
    a.sort((a, b) =>
      sort === 'newest' ? b.date.localeCompare(a.date)
      : sort === 'oldest' ? a.date.localeCompare(b.date)
      : sort === 'mood' ? (b.moodScore || 0) - (a.moodScore || 0)
      : (b.wordCount || 0) - (a.wordCount || 0)
    );
    return a;
  }, [es, q, mood, tag, sort]);

  return (
    <div className="page-rise">
      <div className="topbar">
        <div className="topbar-left">
          <span className="topbar-title">Entries</span>
          <span className="topbar-sep">·</span>
          <span className="topbar-sub">{es.length} total</span>
        </div>
        <div className="topbar-right">
          <button className="btn btn-primary btn-sm" onClick={() => { setEdit(null); setPage('editor'); }}>
            + New
          </button>
        </div>
      </div>

      <div className="page">
        <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-wrap" style={{ flex: 1, minWidth: 180 }}>
            <span className="search-ic">⌕</span>
            <input
              className="input search-input"
              placeholder="Search…"
              value={q}
              onChange={e => setQ(e.target.value)}
            />
          </div>
          <select className="input" style={{ width: 'auto', minWidth: 130 }} value={mood} onChange={e => setMood(e.target.value)}>
            <option value="">All moods</option>
            {MOODS.map(m => <option key={m} value={m}>{m} {MLABELS[m]}</option>)}
          </select>
          {tags.length > 0 && (
            <select className="input" style={{ width: 'auto', minWidth: 120 }} value={tag} onChange={e => setTag(e.target.value)}>
              <option value="">All tags</option>
              {tags.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          )}
          <select className="input" style={{ width: 'auto', minWidth: 130 }} value={sort} onChange={e => setSort(e.target.value)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="mood">By mood</option>
            <option value="words">Longest first</option>
          </select>
        </div>

        {list.length === 0 ? (
          <div className="surface">
            <div className="empty-wrap">
              <div className="empty-glyph">{es.length === 0 ? '◎' : '○'}</div>
              <div className="empty-title">{es.length === 0 ? 'Begin here' : 'Nothing matches'}</div>
              <div className="empty-desc">
                {es.length === 0
                  ? 'Your first entry is a single sentence away.'
                  : 'Try a different search or filter.'}
              </div>
              {es.length === 0 && (
                <button
                  className="btn btn-primary"
                  style={{ marginTop: 16 }}
                  onClick={() => { setEdit(null); setPage('editor'); }}
                >
                  Write first entry
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="masonry stagger">
            {list.map(e => (
              <EntryCard key={e.id} entry={e} onClick={() => { setEdit(e); setPage('editor'); }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
