import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="flex items-center justify-between border-b border-ink-100 bg-white px-6 py-4">
      <p className="font-display text-lg font-semibold text-ink-700">Ledger</p>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-ink-800">{user?.fullName}</p>
          <p className="text-xs capitalize text-ink-400">{user?.role?.replace('_', ' ')}</p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-md border border-ink-200 px-3 py-1.5 text-sm font-medium text-ink-600 hover:bg-ink-50"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
