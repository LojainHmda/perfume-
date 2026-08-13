import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useCursorStore } from '../../store/useStore';

type Status = 'idle' | 'sending' | 'done' | 'error';

/**
 * Centred headline, one rule of an input, no box. The field is a line rather
 * than a form control — the section has to read as an invitation, not a signup
 * widget.
 */
export const Newsletter: React.FC = () => {
  const { setCursor, resetCursor } = useCursorStore();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setStatus('error');
        setMessage(payload.error ?? 'Something went wrong.');
        return;
      }
      setStatus('done');
      setMessage('You are on the list.');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Could not reach the house. Try again.');
    }
  };

  return (
    <section
      className="w-full border-t border-[color:var(--border-subtle)] bg-obsidian px-6 py-24 sm:px-10 sm:py-28 lg:px-16"
      aria-label="Correspondence"
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <p className="notation text-ash">Correspondence</p>
        <h2 className="display mt-5 text-[clamp(1.8rem,4.4vw,3.2rem)] text-porcelain">
          First to know, first to wear.
        </h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-ash">
          Openings, private commissions and the occasional note from the atelier. Nothing else.
        </p>

        <form onSubmit={submit} className="mt-10 flex w-full max-w-md items-end gap-4">
          <label className="flex-1 text-left">
            <span className="sr-only">Email address</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="your@email.com"
              className="w-full border-b border-[color:var(--border-subtle)] bg-transparent pb-3 text-sm text-porcelain outline-none transition-colors placeholder:text-ash/60 focus:border-[color:var(--accent-type)]"
            />
          </label>
          <button
            type="submit"
            disabled={status === 'sending'}
            onMouseEnter={() => setCursor('SUBSCRIBE', 'button')}
            onMouseLeave={resetCursor}
            className="eyebrow border-b border-[color:var(--accent-type)] pb-3 text-porcelain transition-opacity hover:opacity-70 disabled:opacity-40"
          >
            {status === 'sending' ? 'Sending' : 'Subscribe'}
          </button>
        </form>

        {status !== 'idle' && status !== 'sending' && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-5 text-[0.6875rem] tracking-[0.18em] uppercase ${
              status === 'error' ? 'text-[color:var(--accent-type)]' : 'text-ash'
            }`}
            role="status"
          >
            {message}
          </motion.p>
        )}
      </div>
    </section>
  );
};
