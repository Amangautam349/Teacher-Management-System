import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

const emptyForm = {
  fullName: '', email: '', password: '', employeeCode: '',
  departmentId: '', phone: '', designation: '', qualification: '',
};

export default function Teachers() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'super_admin';

  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function loadTeachers(q = '') {
    api.get('/teachers', { params: q ? { search: q } : {} }).then(({ data }) => setTeachers(data));
  }

  useEffect(() => {
    loadTeachers();
    api.get('/departments').then(({ data }) => setDepartments(data));
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    loadTeachers(search);
  }

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/teachers', form);
      setForm(emptyForm);
      setShowForm(false);
      loadTeachers();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create teacher.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Remove this teacher? Their login will be deleted too.')) return;
    await api.delete(`/teachers/${id}`);
    loadTeachers(search);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold text-ink-800">Teachers</h2>
        {isAdmin && (
          <button
            onClick={() => setShowForm((s) => !s)}
            className="rounded-md bg-ink-800 px-4 py-2 text-sm font-semibold text-white hover:bg-ink-700"
          >
            {showForm ? 'Cancel' : 'Add teacher'}
          </button>
        )}
      </div>

      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or employee code…"
          className="w-full max-w-sm rounded-md border border-ink-200 px-3 py-2 text-sm focus:border-amber-500"
        />
        <button
          type="submit"
          className="rounded-md border border-ink-200 px-4 py-2 text-sm font-medium text-ink-600 hover:bg-ink-50"
        >
          Search
        </button>
      </form>

      {isAdmin && showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-6 grid grid-cols-1 gap-4 rounded-lg border border-ink-100 bg-white p-5 sm:grid-cols-2"
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-ink-500">Full name</span>
            <input required value={form.fullName} onChange={(e) => updateField('fullName', e.target.value)}
              className="rounded-md border border-ink-200 px-3 py-2 text-sm focus:border-amber-500" />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-ink-500">Email (used to log in)</span>
            <input required type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)}
              className="rounded-md border border-ink-200 px-3 py-2 text-sm focus:border-amber-500" />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-ink-500">Temporary password</span>
            <input required type="text" value={form.password} onChange={(e) => updateField('password', e.target.value)}
              className="rounded-md border border-ink-200 px-3 py-2 text-sm focus:border-amber-500" />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-ink-500">Employee code</span>
            <input required value={form.employeeCode} onChange={(e) => updateField('employeeCode', e.target.value)}
              className="rounded-md border border-ink-200 px-3 py-2 text-sm focus:border-amber-500" />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-ink-500">Department</span>
            <select value={form.departmentId} onChange={(e) => updateField('departmentId', e.target.value)}
              className="rounded-md border border-ink-200 px-3 py-2 text-sm focus:border-amber-500">
              <option value="">— None —</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-ink-500">Phone</span>
            <input value={form.phone} onChange={(e) => updateField('phone', e.target.value)}
              className="rounded-md border border-ink-200 px-3 py-2 text-sm focus:border-amber-500" />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-ink-500">Designation</span>
            <input value={form.designation} onChange={(e) => updateField('designation', e.target.value)}
              className="rounded-md border border-ink-200 px-3 py-2 text-sm focus:border-amber-500" />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-ink-500">Qualification</span>
            <input value={form.qualification} onChange={(e) => updateField('qualification', e.target.value)}
              className="rounded-md border border-ink-200 px-3 py-2 text-sm focus:border-amber-500" />
          </label>

          {error && <p className="sm:col-span-2 text-sm text-red-600">{error}</p>}

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-60"
            >
              {submitting ? 'Creating…' : 'Create teacher'}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-lg border border-ink-100 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-50 text-xs font-semibold uppercase tracking-wide text-ink-400">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Employee Code</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Designation</th>
              <th className="px-4 py-3">Status</th>
              {isAdmin && <th className="px-4 py-3" />}
            </tr>
          </thead>
          <tbody>
            {teachers.map((t) => (
              <tr key={t.id} className="border-t border-ink-100">
                <td className="px-4 py-3 font-medium text-ink-800">{t.fullName}</td>
                <td className="px-4 py-3 text-ink-500">{t.employeeCode}</td>
                <td className="px-4 py-3 text-ink-500">{t.department?.name || '—'}</td>
                <td className="px-4 py-3 text-ink-500">{t.designation || '—'}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      t.isActive ? 'bg-sage-50 text-sage-500' : 'bg-ink-100 text-ink-400'
                    }`}
                  >
                    {t.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                {isAdmin && (
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-xs font-medium text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {teachers.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? 6 : 5} className="px-4 py-6 text-center text-ink-400">
                  No teachers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
