'use client';
import { useState } from 'react';
import { WELCOME_STEPS } from '@/lib/constants';

interface Props {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: Props) {
  const [step, setStep] = useState(0);
  const s = WELCOME_STEPS[step];

  return (
    <div className="welcome-wrap">
      <div className="welcome-box">
        <span className="welcome-glyph">{s.g}</span>
        <h1 className="welcome-title">{s.title}</h1>
        <p className="welcome-body">{s.body}</p>

        <div className="progress-dots">
          {WELCOME_STEPS.map((_, i) => (
            <div
              key={i}
              className={`pdot ${i === step ? 'on' : ''}`}
              onClick={() => setStep(i)}
            />
          ))}
        </div>

        {step < WELCOME_STEPS.length - 1 ? (
          <button
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
            onClick={() => setStep(s => s + 1)}
          >
            Continue
          </button>
        ) : (
          <button
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
            onClick={onStart}
          >
            Begin writing
          </button>
        )}

        {step < WELCOME_STEPS.length - 1 && (
          <button
            className="btn btn-ghost btn-sm"
            style={{ width: '100%', marginTop: 10 }}
            onClick={onStart}
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}
