'use client';
import { useEffect } from 'react';
import { CFETTI } from '@/lib/constants';

/* ── Confetti ─────────────────────────────── */
interface ConfettiProps { on: boolean; }

export function Confetti({ on }: ConfettiProps) {
  if (!on) return null;
  const pcs = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 1.8,
    dur: 2.2 + Math.random() * 1.4,
    color: CFETTI[i % CFETTI.length],
    sz: 5 + Math.random() * 7,
    round: Math.random() > 0.5,
  }));

  return (
    <div className="confetti-layer">
      {pcs.map(p => (
        <div
          key={p.id}
          className="cp"
          style={{
            left: `${p.left}%`,
            top: -16,
            width: p.sz,
            height: p.sz,
            background: p.color,
            borderRadius: p.round ? '50%' : '2px',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Toast ────────────────────────────────── */
interface ToastProps { msg: string; onClose: () => void; }

export function Toast({ msg, onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 2400);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="toast-wrap">
      <div className="toast">✓ {msg}</div>
    </div>
  );
}
