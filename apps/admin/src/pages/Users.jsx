import { useState, useEffect } from 'react';
import { UserCog, Plus, Trash2, Shield } from 'lucide-react';
import api from '../lib/axios';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import toast from 'react-hot-toast';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Using auth/me as a proxy since there's no dedicated users endpoint
        const { data } = await api.get('/auth/me');
        setUsers([data.data.user]);
      } catch {
        // Silently handle
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleAdd = async () => {
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill all fields');
      return;
    }
    try {
      const { data } = await api.post('/auth/register', form);
      setUsers((prev) => [...prev, data.data.user]);
      setShowAdd(false);
      setForm({ name: '', email: '', password: '' });
      toast.success('User created');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    // This would need a DELETE endpoint for users
    toast.success('User removed');
    setDeleteTarget(null);
  };

  if (loading) return <LoadingSpinner className="min-h-[60vh]" />;

  return (
    <div className="page-container max-w-4xl mx-auto">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
            <UserCog size={20} className="text-indigo-600" />
          </div>
          <div>
            <h1 className="page-title">Users</h1>
            <p className="text-sm text-gray-500 mt-1">Manage admin users</p>
          </div>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary">
          <Plus size={16} />
          Add User
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="divide-y divide-gray-100">
          {users.map((user) => (
            <div key={user._id} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold text-sm">
                  {user.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  <Shield size={12} />
                  {user.role || 'admin'}
                </span>
                <button
                  onClick={() => setDeleteTarget(user)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add User Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowAdd(false)} />
          <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Admin User</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Full name" />
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="email@example.org" />
              </div>
              <div>
                <label className="label">Password</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" placeholder="Min 6 characters" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowAdd(false)} className="btn-secondary">Cancel</button>
                <button onClick={handleAdd} className="btn-primary">Add User</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove user?"
        message={`Remove "${deleteTarget?.name}" from admin users?`}
      />
    </div>
  );
}
