import { JournalEntry } from './types';

/* ── Storage ──────────────────────────────── */
export const S = {
  get: <T>(k: string, d: T): T => {
    try {
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : d;
    } catch { return d; }
  },
  set: (k: string, v: unknown) => {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
  },
};

/* ── Date helpers ─────────────────────────── */
export const tod = () => new Date().toISOString().split('T')[0];

export const wc = (t: string) =>
  t.trim() ? t.trim().split(/\s+/).length : 0;

export const fmtLong = (d: string) =>
  new Date(d + 'T12:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

export const fmtShort = (d: string) =>
  new Date(d + 'T12:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

export const fmtMed = (d: string) =>
  new Date(d + 'T12:00').toLocaleDateString('en-US', {
    month: 'long', day: 'numeric',
  });

export const greet = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

/* ── Streak ───────────────────────────────── */
export const streak = (entries: JournalEntry[]): number => {
  if (!entries.length) return 0;
  const dates = [...new Set(entries.map(e => e.date))].sort().reverse();
  let n = 0;
  let cur = new Date();
  cur.setHours(12, 0, 0, 0);
  for (const d of dates) {
    const ed = new Date(d + 'T12:00');
    if (Math.round((cur.getTime() - ed.getTime()) / 86400000) <= 1) {
      n++;
      cur = ed;
    } else break;
  }
  return n;
};

/* ── Entry factory ────────────────────────── */
export const mkEntry = (o: Partial<JournalEntry> = {}): JournalEntry => ({
  id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
  date: tod(),
  title: '',
  content: '',
  moodEmoji: '',
  moodScore: 5,
  tags: [],
  gratitude: ['', '', ''],
  wordCount: 0,
  createdAt: new Date().toISOString(),
  ...o,
});
