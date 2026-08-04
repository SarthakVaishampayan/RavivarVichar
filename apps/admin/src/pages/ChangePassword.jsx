import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Eye, EyeOff } from 'lucide-react';
import api from '../lib/axios';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (form.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (form.currentPassword === form.newPassword) {
      toast.error('New password must be different from the current one');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.put('/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success(data.message || 'Password changed successfully');
      // Password change revokes all sessions — log out and return to login
      logout();
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'input-field pr-10';
  const toggle = (key) => setShow((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="page-container max-w-lg mx-auto">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
            <KeyRound size={20} className="text-primary-600" />
          </div>
          <div>
            <h1 className="page-title">Change Password</h1>
            <p className="text-sm text-gray-500 mt-1">
              You'll be logged out after a successful change.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card p-8 space-y-5">
        {[
          { key: 'current', label: 'Current password', field: 'currentPassword' },
          { key: 'next', label: 'New password (min 8 characters)', field: 'newPassword' },
          { key: 'confirm', label: 'Confirm new password', field: 'confirmPassword' },
        ].map(({ key, label, field }) => (
          <div key={key}>
            <label className="label">{label}</label>
            <div className="relative">
              <input
                type={show[key] ? 'text' : 'password'}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className={inputCls}
                required
              />
              <button
                type="button"
                onClick={() => toggle(key)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {show[key] ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        ))}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Updating…' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
