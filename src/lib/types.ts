export interface JournalEntry {
  id: string;
  date: string;         // YYYY-MM-DD
  title: string;
  content: string;
  moodEmoji: string;
  moodScore: number;    // 1-10
  tags: string[];
  gratitude: [string, string, string];
  wordCount: number;
  createdAt: string;    // ISO string
}

export type Page = 'dashboard' | 'editor' | 'entries' | 'calendar' | 'analytics' | 'settings';

export interface AccentOption {
  name: string;
  val: string;
  bg: string;
  bd: string;
}
