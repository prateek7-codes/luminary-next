'use client';
import { JournalEntry } from '@/lib/types';
import { ACCENTS } from '@/lib/constants';
import { S, tod } from '@/lib/utils';

interface Props {
  dark: boolean;
  setDark: (fn: (d: boolean) => boolean) => void;
  entries: JournalEntry[];
  setEntries: (fn: (prev: JournalEntry[]) => JournalEntry[]) => void;
  showToast: (msg: string) => void;
  accent: string;
  setAccent: (v: string) => void;
}

export default function Settings({ dark, setDark, entries: es, setEntries, showToast, accent, setAccent }: Props) {
  const exportJSON = () => {
    const b = new Blob([JSON.stringify(es, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(b);
    a.download = `luminary-${tod()}.json`;
    a.click();
    showToast('Journal exported');
  };

  const clearAll = () => {
    if (confirm('Delete all entries? This cannot be undone.')) {
      setEntries(() => []);
      S.set('entries', []);
      showToast('All data cleared');
    }
  };

  const applyAccent = (o: typeof ACCENTS[number]) => {
    setAccent(o.val);
    document.documentElement.style.setProperty('--tint', o.val);
    document.documentElement.style.setProperty('--tint-bg', o.bg);
    document.documentElement.style.setProperty('--tint-border', o.bd);
    S.set('accent', JSON.stringify(o));
    showToast(`${o.name} applied`);
  };

  return (
    <div className="page-rise">
      <div className="topbar">
        <div className="topbar-left">
          <span className="topbar-title">Settings</span>
        </div>
      </div>

      <div className="page">
        <div className="settings-surface stagger">

          <div className="settings-group">
            <div className="settings-group-title">Appearance</div>
            <div className="s-row">
              <div>
                <div className="s-title">Dark mode</div>
                <div className="s-desc">Switch between light and dark</div>
              </div>
              <div className={`pill ${dark ? 'on' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setDark(d => !d)}>
                <div className="pill-thumb" />
              </div>
            </div>
            <div className="s-row">
              <div>
                <div className="s-title">Accent color</div>
                <div className="s-desc">Choose your personal tone</div>
              </div>
              <div className="swatches">
                {ACCENTS.map(o => (
                  <div
                    key={o.val}
                    className={`swatch ${accent === o.val ? 'on' : ''}`}
                    style={{ background: o.val }}
                    title={o.name}
                    onClick={() => applyAccent(o)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="settings-group">
            <div className="settings-group-title">Data</div>
            <div className="s-row">
              <div>
                <div className="s-title">Export journal</div>
                <div className="s-desc">Download as JSON</div>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={exportJSON}>Export</button>
            </div>
            <div className="s-row">
              <div>
                <div className="s-title" style={{ color: 'var(--red)' }}>Clear all data</div>
                <div className="s-desc">Permanently delete every entry</div>
              </div>
              <button className="btn btn-danger btn-sm" onClick={clearAll}>Clear</button>
            </div>
          </div>

          <div className="settings-group">
            <div className="settings-group-title">Keyboard shortcuts</div>
            <div className="kbd-list">
              {[
                ['New entry', '⌘', 'N'],
                ['Dashboard', '⌘', '1'],
                ['Entries',   '⌘', '2'],
                ['Calendar',  '⌘', '3'],
              ].map(([action, ...keys]) => (
                <div key={action} className="kbd-item">
                  <span className="kbd-action">{action}</span>
                  <div className="kbd-keys">
                    {keys.map(k => <span key={k} className="k">{k}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="settings-group">
            <div style={{ padding: '20px 24px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 18, color: 'var(--ink-2)', marginBottom: 4 }}>
                Luminary
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>A quiet journal for everyday reflection</div>
              <div style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 6 }}>v3.0 · made with care</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
