'use client';
import { useState, useEffect, useRef } from 'react';
import { JournalEntry } from '@/lib/types';
import { MOODS, MLABELS } from '@/lib/constants';
import { tod, wc, fmtLong, fmtShort, streak, mkEntry } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

interface Props {
  entries: JournalEntry[];
  setEntries: (fn: (prev: JournalEntry[]) => JournalEntry[]) => void;
  editEntry: JournalEntry | null;
  showToast: (msg: string) => void;
  showConfetti: () => void;
}

export default function Editor({ entries: es, setEntries, editEntry, showToast, showConfetti }: Props) {

  const base = editEntry || es.find(e => e.date === tod()) || mkEntry();
  const [entry, setEntry] = useState<JournalEntry>(base);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(true);
  const [tagIn, setTagIn] = useState('');

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevStreak = useRef(streak(es));
  const titleRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (titleRef.current && !entry.title) titleRef.current.focus();
  }, []);

  const upd = (k: keyof JournalEntry, v: unknown) => {
    setSaved(false);
    setSaving(true);

    setEntry(prev => {
      const n = { ...prev, [k]: v };

      if (k === 'content') {
        n.wordCount = wc(v as string);
      }

      return n;
    });
  };

  useEffect(() => {

    if (saved) return;

    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(async () => {

      const idx = es.findIndex(x => x.id === entry.id);

      const next =
        idx >= 0
          ? [...es.slice(0, idx), entry, ...es.slice(idx + 1)]
          : [entry, ...es];

      setEntries(() => next);

      const { error } = await supabase.from('entries').insert({
  content: entry.content,
  mood: entry.moodEmoji,
  tags: entry.tags
});

      if (error) {
        console.error('Supabase save error:', error);
      }

      const ns = streak(next);

      if (ns > prevStreak.current && ns > 1) {
        showConfetti();
        prevStreak.current = ns;
      }

      setSaving(false);
      setSaved(true);

    }, 900);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };

  }, [entry, saved]);

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {

    if ((e.key === 'Enter' || e.key === ',') && tagIn.trim()) {

      e.preventDefault();

      const t = tagIn.trim().replace(/,/, '');

      if (!entry.tags.includes(t)) {
        upd('tags', [...entry.tags, t]);
      }

      setTagIn('');

    }

  };

  const rmTag = (t: string) => upd('tags', entry.tags.filter(x => x !== t));

  const updGrat = (i: number, v: string) => {
    const g = [...entry.gratitude] as [string, string, string];
    g[i] = v;
    upd('gratitude', g);
  };

  const sliderPct = `${((entry.moodScore - 1) / 9) * 100}%`;

  return (
    <div className="editor-wrap page-rise">

      <div className="topbar editor-meta">

        <div className="editor-meta-left">

          <span className="topbar-title" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 15 }}>
            {entry.date === tod() ? 'Today' : fmtShort(entry.date)}
          </span>

          <span className="topbar-sep">·</span>

          <div className="save-status">
            <div className={`save-dot ${saving ? 'saving' : ''}`} />
            <span>{saving ? 'Saving…' : 'Saved'}</span>
          </div>

        </div>

        <div className="editor-meta-right">
          <span className="wc-display">{entry.wordCount} words</span>
          <button className="btn btn-secondary btn-sm" onClick={() => showToast('Entry saved')}>
            Save
          </button>
        </div>

      </div>

      <div className="editor-cols">

        <div className="writing-pane">

          <div className="writing-scroll">

            <div className="editor-date-hint">{fmtLong(entry.date)}</div>

            <textarea
              ref={titleRef}
              className="editor-title"
              placeholder="Give this entry a title…"
              value={entry.title}
              rows={1}
              onChange={e => upd('title', e.target.value)}
            />

            <hr className="editor-rule" />

            <textarea
              className="editor-body"
              placeholder="Begin writing. Let your thoughts arrive without judgment…"
              value={entry.content}
              onChange={e => upd('content', e.target.value)}
            />

          </div>

        </div>

        <div className="editor-aside">

          <div className="aside-section">

            <div className="aside-label">Mood</div>

            <div className="mood-grid">

              {MOODS.map(m => (
                <button
                  key={m}
                  className={`mood-btn ${entry.moodEmoji === m ? 'on' : ''}`}
                  onClick={() => upd('moodEmoji', m)}
                  title={MLABELS[m]}
                >
                  {m}
                </button>
              ))}

            </div>

            <input
              type="range"
              min={1}
              max={10}
              value={entry.moodScore}
              className="mslider"
              style={{ ['--pct' as string]: sliderPct }}
              onChange={e => upd('moodScore', +e.target.value)}
            />

          </div>

          <div className="aside-section">

            <div className="aside-label">Tags</div>

            {entry.tags.length > 0 && (
              <div className="tag-row">
                {entry.tags.map(t => (
                  <span key={t} className="tag">
                    {t}
                    <button className="tag-del" onClick={() => rmTag(t)}>✕</button>
                  </span>
                ))}
              </div>
            )}

            <input
              className="input"
              placeholder="Add tag, press Enter…"
              value={tagIn}
              onChange={e => setTagIn(e.target.value)}
              onKeyDown={addTag}
            />

          </div>

        </div>

      </div>

    </div>
  );

}
