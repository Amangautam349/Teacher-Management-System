import { useEffect, useState } from 'react';
import api from '../api/axios.js';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function loadDepartments() {
    api.get('/departments').then(({ data }) => setDepartments(data));
  }

  useEffect(loadDepartments, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/departments', { name, description });
      setName('');
      setDescription('');
      loadDepartments();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create department.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this department? Teachers in it will become unassigned.')) return;
    await api.delete(`/departments/${id}`);
    loadDepartments();
  }

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl font-semibold text-ink-800">Departments</h2>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-lg border border-ink-100 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-ink-50 text-xs font-semibold uppercase tracking-wide text-ink-400">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Teachers</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {departments.map((d) => (
                  <tr key={d.id} className="border-t border-ink-100">
                    <td className="px-4 py-3 font-medium text-ink-800">{d.name}</td>
                    <td className="px-4 py-3 text-ink-500">{d.description || '—'}</td>
                    <td className="px-4 py-3 text-ink-500">{d.teacher_count}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="text-xs font-medium text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {departments.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-ink-400">
                      No departments yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <form
          onSubmit={handleCreate}
          className="h-fit rounded-lg border border-ink-100 bg-white p-5"
        >
          <h3 className="mb-4 text-sm font-semibold text-ink-700">Add department</h3>

          <label className="mb-3 flex flex-col gap-1.5">
            <span className="text-xs font-medium text-ink-500">Name</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-md border border-ink-200 px-3 py-2 text-sm focus:border-amber-500"
            />
          </label>

          <label className="mb-4 flex flex-col gap-1.5">
            <span className="text-xs font-medium text-ink-500">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="rounded-md border border-ink-200 px-3 py-2 text-sm focus:border-amber-500"
            />
          </label>

          {error && <p className="mb-3 text-xs text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-ink-800 px-4 py-2 text-sm font-semibold text-white hover:bg-ink-700 disabled:opacity-60"
          >
            {submitting ? 'Adding…' : 'Add department'}
          </button>
        </form>
      </div>
    </div>
  );
}
