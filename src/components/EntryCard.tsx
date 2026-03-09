'use client';
import { JournalEntry } from '@/lib/types';
import { fmtShort } from '@/lib/utils';

interface Props {
  entry: JournalEntry;
  onClick: () => void;
}

export default function EntryCard({ entry, onClick }: Props) {
  return (
    <div className="card-wrap">
      <div className="e-card" onClick={onClick}>
        <div className="e-date">
          {fmtShort(entry.date)}
          {entry.moodEmoji && <span style={{ fontSize: 13 }}>{entry.moodEmoji}</span>}
        </div>
        <div className="e-title">{entry.title || 'Untitled'}</div>
        {entry.content && <div className="e-excerpt">{entry.content}</div>}
        {entry.tags?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
            {entry.tags.slice(0, 3).map(t => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        )}
        <div className="e-foot">
          <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>
            {entry.moodScore ? `${entry.moodScore}/10` : ''}
          </span>
          <span className="e-wc">{entry.wordCount || 0} words</span>
        </div>
      </div>
    </div>
  );
}
