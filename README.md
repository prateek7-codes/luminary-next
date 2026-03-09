# Luminary — Next.js Journal App

A minimal, calm daily journaling app built with **Next.js 14 App Router** and **TypeScript**.  
Ported from the single-file `luminary-v3.html` into a proper component-based project.

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Folder Structure

```
luminary/
├── next.config.js
├── package.json
├── tsconfig.json
└── src/
    ├── app/
    │   ├── globals.css          # All design tokens, reset, component styles
    │   ├── layout.tsx           # Root layout (HTML shell, metadata)
    │   └── page.tsx             # Entry route → renders <App />
    ├── components/
    │   ├── App.tsx              # Root client component — state, routing, shortcuts
    │   ├── Sidebar.tsx          # Fixed left nav with streak + theme toggle
    │   ├── Dashboard.tsx        # Home: hero, stats, heatmap, recent entries
    │   ├── Editor.tsx           # Writing pane + mood/gratitude/tags aside
    │   ├── Entries.tsx          # All entries list with search + filter
    │   ├── EntryCard.tsx        # Reusable masonry card
    │   ├── Calendar.tsx         # Month calendar with day-entry panel
    │   ├── Analytics.tsx        # Mood charts, weekly bars, tag cloud
    │   ├── Settings.tsx         # Appearance, data export, shortcuts
    │   ├── WelcomeScreen.tsx    # 3-step onboarding overlay
    │   ├── MiniCal.tsx          # Mini calendar widget (used in Dashboard)
    │   ├── Sparkline.tsx        # Mood trend SVG sparkline (used in Dashboard)
    │   └── Overlays.tsx         # Confetti + Toast components
    └── lib/
        ├── types.ts             # TypeScript interfaces (JournalEntry, Page, etc.)
        ├── constants.ts         # Quotes, prompts, moods, accents, nav items
        └── utils.ts             # Storage (localStorage), date helpers, streak, mkEntry
```

---

## Key Design Decisions

| Decision | Rationale |
|---|---|
| **App Router** | `src/app/page.tsx` is a Server Component that renders `<App />` |
| **`'use client'`** | Every component that touches state or localStorage is a client component |
| **CSS Modules skipped** | All styles live in `globals.css` using the exact CSS custom properties from v3 — zero class name collisions because styles are already component-scoped by class name convention |
| **No Tailwind** | The v3 design relies on CSS custom properties (`--tint`, `--bg-raised`, etc.) for live theme/accent switching. Tailwind would require JIT purge config and class mapping for dynamic values — plain CSS is cleaner here |
| **localStorage** | All data is client-side only. `utils.ts` exports a thin `S` wrapper that catches SSR/hydration errors |
| **No external state library** | React `useState` + prop drilling is sufficient for this app's size |

---

## Data Model

```ts
interface JournalEntry {
  id: string;           // Date.now().toString(36) + random
  date: string;         // YYYY-MM-DD
  title: string;
  content: string;
  moodEmoji: string;
  moodScore: number;    // 1–10
  tags: string[];
  gratitude: [string, string, string];
  wordCount: number;
  createdAt: string;    // ISO string
}
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `⌘/Ctrl + N` | New entry |
| `⌘/Ctrl + 1` | Dashboard |
| `⌘/Ctrl + 2` | All Entries |
| `⌘/Ctrl + 3` | Calendar |

---

## Theming

Accent color and dark mode are stored in `localStorage` and applied as CSS custom property overrides on `document.documentElement`. The dark theme uses the `[data-theme="dark"]` selector in `globals.css`.

To add a new accent: add an entry to `ACCENTS` in `src/lib/constants.ts`.
