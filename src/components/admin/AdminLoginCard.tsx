import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, Lock, ShieldCheck } from 'lucide-react';
import { ADMIN_CREDENTIALS, useAdminAuthStore } from '../../store/useAdminAuthStore';

/**
 * The gate. Credentials are checked by the server, which issues the bearer
 * token every write route requires — the panel cannot be reached by flipping a
 * flag in the browser.
 */
export const AdminLoginCard: React.FC<{ onAuthenticated: (message: string) => void }> = ({
  onAuthenticated,
}) => {
  const navigate = useNavigate();
  const login = useAdminAuthStore((state) => state.login);

  const [username, setUsername] = useState(ADMIN_CREDENTIALS.user);
  const [password, setPassword] = useState(ADMIN_CREDENTIALS.pass);
  const [error, setError] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  const attempt = async (user: string, pass: string) => {
    setIsBusy(true);
    const result = await login(user, pass);
    setIsBusy(false);

    if (result.success) {
      setError('');
      onAuthenticated(result.message);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070708] px-4 pb-12 pt-24 font-sans text-white">
      <div className="relative w-full max-w-md space-y-6 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl sm:p-8">
        <div className="space-y-2 text-center">
          <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full border border-red-500/30 bg-red-950/60 text-red-400">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="font-serif text-2xl font-light uppercase tracking-wider text-white">
            Admin Portal Login
          </h1>
          <p className="text-xs text-zinc-400">
            Hero artwork, catalogue, pricing, product images and the four product films.
          </p>
        </div>

        <div className="space-y-2 rounded-xl border border-amber-500/30 bg-amber-950/30 p-4 text-xs text-amber-200">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-amber-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              Default credentials
            </span>
            <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300">
              Admin role
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
            <div>
              <span className="block text-[10px] uppercase text-zinc-500">Username</span>
              <span className="font-bold text-white">{ADMIN_CREDENTIALS.user}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase text-zinc-500">Password</span>
              <span className="font-bold text-white">{ADMIN_CREDENTIALS.pass}</span>
            </div>
          </div>

          <p className="pt-1 text-[10px] leading-relaxed text-amber-200/70">
            Set ADMIN_USER and ADMIN_PASS in the environment to replace this pair.
          </p>

          <button
            type="button"
            disabled={isBusy}
            onClick={() => void attempt(ADMIN_CREDENTIALS.user, ADMIN_CREDENTIALS.pass)}
            className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-amber-400 px-3 py-2 text-xs font-bold uppercase tracking-wider text-zinc-950 transition-colors hover:bg-amber-300 disabled:opacity-60"
          >
            <Key className="h-3.5 w-3.5" />
            <span>Autofill &amp; log in</span>
          </button>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void attempt(username, password);
          }}
          className="space-y-4 pt-2"
        >
          <div>
            <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-zinc-400">
              Admin username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-white transition-colors focus:border-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-zinc-400">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-white transition-colors focus:border-red-500 focus:outline-none"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-900/50 bg-red-950/40 p-2.5 text-xs text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isBusy}
            className="w-full cursor-pointer rounded-lg bg-red-600 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-red-500 disabled:opacity-60"
          >
            {isBusy ? 'Checking…' : 'Enter admin panel'}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="font-mono text-xs uppercase tracking-wider text-zinc-500 underline hover:text-zinc-300"
          >
            ← Back to storefront
          </button>
        </div>
      </div>
    </div>
  );
};
