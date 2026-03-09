'use client';

import { useState, useEffect } from 'react';
import { JournalEntry, Page } from '@/lib/types';
import { S } from '@/lib/utils';

import Sidebar from './Sidebar';
import WelcomeScreen from './WelcomeScreen';
import Dashboard from './Dashboard';
import Editor from './Editor';
import Entries from './Entries';
import Calendar from './Calendar';
import Analytics from './Analytics';
import Settings from './Settings';
import { Confetti, Toast } from './Overlays';

export default function App() {

  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    if (typeof window === 'undefined') return [];
    return S.get<JournalEntry[]>('entries', []);
  });

  const [page, setPageRaw] = useState<Page>('dashboard');

  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return S.get<boolean>('theme', false);
  });

  const [editEntry, setEditEntry] = useState<JournalEntry | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [confetti, setConfetti] = useState(false);

  const [welcome, setWelcome] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return !S.get<boolean>('welcomed', false);
  });

  const [accent, setAccent] = useState<string>(() => {
    if (typeof window === 'undefined') return '#a16207';
    const saved = S.get<{ val: string } | null>('accent', null);
    return saved?.val ?? '#a16207';
  });

  // Apply theme
  useEffect(() => {
    S.set('theme', dark);
    document.documentElement.setAttribute(
      'data-theme',
      dark ? 'dark' : 'light'
    );
  }, [dark]);

  // Persist entries
  useEffect(() => {
    S.set('entries', entries);
  }, [entries]);

  // Keyboard shortcuts
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {

        if (e.key === 'n') {
          e.preventDefault();
          setEditEntry(null);
          setPageRaw('editor');
        }

        if (e.key === '1') {
          e.preventDefault();
          setPageRaw('dashboard');
        }

        if (e.key === '2') {
          e.preventDefault();
          setPageRaw('entries');
        }

        if (e.key === '3') {
          e.preventDefault();
          setPageRaw('calendar');
        }
      }
    };

    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);

  }, []);

  const setPage = (p: Page) => {
    if (p !== 'editor') setEditEntry(null);
    setPageRaw(p);
  };

  const showToast = (msg: string) => setToast(msg);

  const showConfetti = () => {
    setConfetti(true);
    setTimeout(() => setConfetti(false), 3200);
  };

  const renderPage = () => {
    switch (page) {

      case 'dashboard':
        return (
          <Dashboard
            entries={entries}
            setPage={setPage}
            setEdit={setEditEntry}
          />
        );

      case 'editor':
        return (
          <Editor
            entries={entries}
            setEntries={setEntries}
            editEntry={editEntry}
            showToast={showToast}
            showConfetti={showConfetti}
          />
        );

      case 'entries':
        return (
          <Entries
            entries={entries}
            setPage={setPage}
            setEdit={setEditEntry}
          />
        );

      case 'calendar':
        return (
          <Calendar
            entries={entries}
            setPage={setPage}
            setEdit={setEditEntry}
          />
        );

      case 'analytics':
        return <Analytics entries={entries} />;

      case 'settings':
        return (
          <Settings
            dark={dark}
            setDark={setDark}
            entries={entries}
            setEntries={setEntries}
            showToast={showToast}
            accent={accent}
            setAccent={setAccent}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>

      {welcome && (
        <WelcomeScreen
          onStart={() => {
            S.set('welcomed', true);
            setWelcome(false);
          }}
        />

      )}

      <Confetti on={confetti} />

      {toast && (
        <Toast
          msg={toast}
          onClose={() => setToast(null)}
        />
      )}

      <div className="shell">

        <Sidebar
          page={page}
          setPage={setPage}
          dark={dark}
          setDark={setDark}
          entries={entries}
        />

        <main className="main">
          {renderPage()}
        </main>

      </div>

      {page !== 'editor' && (

        <button
          className="fab"
          onClick={() => {
            setEditEntry(null);
            setPageRaw('editor');
          }}
          title="New entry (⌘N)"
        >
          +
        </button>

      )}

    </>
  );
}