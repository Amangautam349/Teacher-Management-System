import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-lg border border-ink-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{label}</p>
      <p className={`mt-2 font-display text-3xl font-semibold ${accent || 'text-ink-800'}`}>
        {value}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/dashboard/summary')
      .then(({ data }) => setSummary(data))
      .catch(() => setError('Could not load dashboard summary.'));
  }, []);

  return (
    <div>
      <p className="mb-1 text-sm text-ink-400">Welcome back,</p>
      <h2 className="mb-6 font-display text-2xl font-semibold text-ink-800">{user?.fullName}</h2>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Teachers" value={summary?.totalTeachers ?? '—'} />
        <StatCard label="Departments" value={summary?.totalDepartments ?? '—'} />
        <StatCard
          label="On Leave Today"
          value={summary?.onLeaveToday ?? '—'}
          accent="text-amber-600"
        />
        <StatCard
          label="Pending Leave Requests"
          value={summary?.pendingLeaveRequests ?? '—'}
          accent="text-amber-600"
        />
      </div>

      <div className="mt-8 rounded-lg border border-dashed border-ink-200 bg-white p-6 text-sm text-ink-400">
        Attendance trends, timetable overview, and recent notices will land here in Weeks 4–5.
      </div>
    </div>
  );
}
