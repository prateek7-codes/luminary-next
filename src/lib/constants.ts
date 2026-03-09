import { AccentOption } from './types';

export const QUOTES = [
  { q: 'The unexamined life is not worth living.', a: 'Socrates' },
  { q: 'Journal writing is a voyage to the interior.', a: 'Christina Baldwin' },
  { q: 'Write what should not be forgotten.', a: 'Isabel Allende' },
  { q: 'Fill your paper with the breathings of your heart.', a: 'William Wordsworth' },
  { q: 'In the journal I do not just express myself; I create myself.', a: 'Susan Sontag' },
  { q: 'What lies within us is greater than what lies behind us.', a: 'R.W. Emerson' },
  { q: 'The secret of getting ahead is getting started.', a: 'Mark Twain' },
];

export const PROMPTS = [
  'What made you smile today, even briefly?',
  'Describe a challenge you faced recently. What did it teach you?',
  'What are you most grateful for this week?',
  'If today were a chapter in your life story, what would you title it?',
  'What is something you\'ve been avoiding, and why?',
  'What would you tell your past self from a year ago?',
  'Describe your ideal version of tomorrow.',
  'What does happiness feel like for you right now?',
  'Who has positively affected your life lately?',
  'What small thing brought you comfort today?',
];

export const MOODS = ['😊', '😌', '🤩', '😔', '😤', '😰', '🥰', '🤔', '😴', '🌟'];

export const MLABELS: Record<string, string> = {
  '😊': 'Happy', '😌': 'Calm', '🤩': 'Excited', '😔': 'Sad',
  '😤': 'Frustrated', '😰': 'Anxious', '🥰': 'Grateful',
  '🤔': 'Reflective', '😴': 'Tired', '🌟': 'Amazing',
};

export const ACCENTS: AccentOption[] = [
  { name: 'Amber', val: '#a16207', bg: 'rgba(161,98,7,0.07)',   bd: 'rgba(161,98,7,0.18)' },
  { name: 'Clay',  val: '#92400e', bg: 'rgba(146,64,14,0.07)',  bd: 'rgba(146,64,14,0.18)' },
  { name: 'Sage',  val: '#365314', bg: 'rgba(54,83,20,0.07)',   bd: 'rgba(54,83,20,0.18)' },
  { name: 'Slate', val: '#1e3a5f', bg: 'rgba(30,58,95,0.07)',   bd: 'rgba(30,58,95,0.18)' },
  { name: 'Plum',  val: '#4c1d95', bg: 'rgba(76,29,149,0.07)',  bd: 'rgba(76,29,149,0.18)' },
  { name: 'Stone', val: '#44403c', bg: 'rgba(68,64,60,0.07)',   bd: 'rgba(68,64,60,0.18)' },
];

export const CFETTI = ['#b8834a', '#a8a29e', '#5a8c5a', '#9a88c8', '#d97706', '#78716c'];

export const NAV = [
  { id: 'dashboard' as const, icon: '○', label: 'Home' },
  { id: 'editor'    as const, icon: '◎', label: 'Write' },
  { id: 'entries'   as const, icon: '≡', label: 'Entries' },
  { id: 'calendar'  as const, icon: '□', label: 'Calendar' },
  { id: 'analytics' as const, icon: '◈', label: 'Insights' },
  { id: 'settings'  as const, icon: '◌', label: 'Settings' },
];

export const WELCOME_STEPS = [
  { g: 'L',  title: 'Welcome to Luminary',   body: 'A quiet space for daily reflection, honest writing, and gentle self-discovery.' },
  { g: '✦', title: 'Write without friction', body: 'Capture your thoughts, track your mood, and practice gratitude — all in one calm, focused place.' },
  { g: '◎', title: 'Understand yourself',    body: 'Watch your emotional patterns emerge through mood charts, streaks, and your writing history.' },
];
