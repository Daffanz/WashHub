import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Settings, User, Mail, Phone, Lock, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export default function SettingsPage() {
  const { user, fetchUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/users/${user.id}`, { ...form, role: user.roles?.[0]?.name });
      await fetchUser();
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally { setSaving(false); }
  };

  const roleName = user?.roles?.[0]?.name || 'User';

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
          <Settings className="w-5 h-5 text-primary-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <p className="text-xs text-surface-200">Manage your profile and preferences</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-primary-400" /> Profile Information
        </h3>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-white/3">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xl font-bold">
            {user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div>
            <p className="text-white font-medium">{user?.name}</p>
            <p className="text-sm text-surface-200">{roleName}</p>
            <p className="text-xs text-surface-700">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-sm text-surface-200 mb-1.5 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Full Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm text-surface-200 mb-1.5 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email Address</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm text-surface-200 mb-1.5 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone Number</label>
            <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500" />
          </div>
          <div className="pt-2">
            <button type="submit" disabled={saving} className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all disabled:opacity-50 flex items-center gap-2">
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Account Info */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4 text-primary-400" /> Account Info
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-sm text-surface-200">Role</span>
            <span className="text-sm text-primary-400 font-medium">{roleName}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-sm text-surface-200">Status</span>
            <span className={`text-sm font-medium ${user?.is_active ? 'text-emerald-400' : 'text-red-400'}`}>
              {user?.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-surface-200">Member since</span>
            <span className="text-sm text-surface-200">{new Date(user?.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
