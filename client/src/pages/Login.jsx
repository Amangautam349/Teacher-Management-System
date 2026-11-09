import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-800 px-4">
      <div className="w-full max-w-sm">
        {/* Signature element: a torn "index card" login panel —
            nods to a teacher's roll-call card, the subject the
            whole app is built around. */}
        <div className="relative rounded-sm bg-amber-50 px-8 pb-8 pt-10 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
          <div className="absolute -top-3 left-8 h-6 w-16 -rotate-2 bg-ink-100/80" aria-hidden="true" />

          <p className="font-display text-2xl font-semibold text-ink-800">Ledger</p>
          <p className="mb-8 text-sm text-ink-500">Teacher Management System</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Email
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-md border border-ink-200 bg-white px-3 py-2 text-sm text-ink-800 focus:border-amber-500"
                placeholder="you@school.edu"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Password
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-md border border-ink-200 bg-white px-3 py-2 text-sm text-ink-800 focus:border-amber-500"
                placeholder="••••••••"
              />
            </label>

            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-md bg-ink-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink-700 disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-ink-400">
          Super Admin and Teacher accounts both sign in here.
        </p>
      </div>
    </div>
  );
}
