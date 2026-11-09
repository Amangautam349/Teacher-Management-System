import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navItemBase =
  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors';

function Item({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${navItemBase} ${
          isActive
            ? 'bg-ink-700 text-white'
            : 'text-ink-200 hover:bg-ink-700/60 hover:text-white'
        }`
      }
    >
      {label}
    </NavLink>
  );
}

export default function Sidebar() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'super_admin';

  return (
    <aside className="hidden w-60 shrink-0 flex-col bg-ink-800 px-4 py-6 md:flex">
      <div className="mb-8 px-2">
        <p className="font-display text-lg font-semibold text-white">Ledger</p>
        <p className="text-xs text-ink-300">Teacher Management</p>
      </div>

      <nav className="flex flex-col gap-1">
        <Item to="/dashboard" label="Dashboard" />
        <Item to="/teachers" label="Teachers" />
        {isAdmin && <Item to="/departments" label="Departments" />}
        {/* Placeholders for upcoming weeks — wired up as we build them */}
        <div className="mt-4 border-t border-ink-700 pt-4">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
            Coming soon
          </p>
          <span className="block px-3 py-1.5 text-sm text-ink-400">Attendance</span>
          <span className="block px-3 py-1.5 text-sm text-ink-400">Leave</span>
          <span className="block px-3 py-1.5 text-sm text-ink-400">Timetable</span>
          <span className="block px-3 py-1.5 text-sm text-ink-400">Notices</span>
        </div>
      </nav>
    </aside>
  );
}
