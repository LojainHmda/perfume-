import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, RotateCcw, ShieldCheck } from 'lucide-react';

interface AdminHeaderBarProps {
  username: string | null;
  isSyncing: boolean;
  onReset: () => void;
  onLogout: () => void;
}

export const AdminHeaderBar: React.FC<AdminHeaderBarProps> = ({
  username,
  isSyncing,
  onReset,
  onLogout,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-950 p-6 shadow-xl md:flex-row md:items-center">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/40 bg-red-950/60 text-red-400">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-serif text-2xl font-light uppercase tracking-wider text-white">
              Admin Control Panel
            </h1>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-emerald-300">
              {username ?? 'admin'}
            </span>
            {isSyncing && (
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-amber-300">
                Saving…
              </span>
            )}
          </div>
          <p className="pt-0.5 text-xs text-zinc-400">
            Changes are written to the server, so every visitor sees them — not just this browser.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onReset}
          title="Restore the shipped catalogue and clear every site override"
          className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-xs font-medium text-zinc-400 transition-colors hover:border-zinc-700 hover:text-white"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset all</span>
        </button>

        <button
          onClick={() => navigate('/')}
          className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:text-white"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>View store</span>
        </button>

        <button
          onClick={onLogout}
          className="cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-950/40"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
