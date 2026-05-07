import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm]   = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const handleProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', form);
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    } finally { setSaving(false); }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setSavingPw(true);
    try {
      await api.put('/auth/change-password', pwForm);
      toast.success('Password changed!');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password');
    } finally { setSavingPw(false); }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-black">My Profile</h1>
          <p className="text-white/50 mt-1">Manage your account settings</p>
        </div>

        {/* Avatar */}
        <div className="glass-card p-6 flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center text-4xl font-bold shadow-neon-purple">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="font-bold text-xl">{user?.name}</h2>
            <p className="text-white/50 text-sm">{user?.email}</p>
            <span className={`mt-2 inline-block text-xs px-3 py-1 rounded-full font-medium capitalize ${
              user?.role === 'super_admin' ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30' :
              user?.role === 'club_owner'  ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/30' :
              'bg-white/10 text-white/60 border border-white/10'
            }`}>
              {user?.role?.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Edit profile */}
        <div className="glass-card p-6">
          <h3 className="font-bold text-lg mb-5">Edit Profile</h3>
          <form onSubmit={handleProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Full Name</label>
              <input type="text" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
              <input type="email" value={user?.email} disabled className="input-field opacity-50 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Phone (WhatsApp)</label>
              <div className="flex gap-2">
                <span className="input-field w-14 text-center text-white/50 flex-shrink-0 py-3">+91</span>
                <input type="tel" maxLength={10} value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input-field" />
              </div>
            </div>
            <button type="submit" disabled={saving} className="btn-neon px-6 py-2.5 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change password */}
        <div className="glass-card p-6">
          <h3 className="font-bold text-lg mb-5">Change Password</h3>
          <form onSubmit={handlePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Current Password</label>
              <input type="password" required value={pwForm.currentPassword}
                onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">New Password</label>
              <input type="password" required minLength={8} value={pwForm.newPassword}
                onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                className="input-field" />
            </div>
            <button type="submit" disabled={savingPw} className="btn-outline px-6 py-2.5 disabled:opacity-50">
              {savingPw ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Account info */}
        <div className="glass-card p-6">
          <h3 className="font-bold text-sm mb-4 text-white/70">Account Info</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-white/40">Member Since</p>
              <p className="font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'N/A'}</p>
            </div>
            <div>
              <p className="text-white/40">Last Login</p>
              <p className="font-medium">{user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString('en-IN') : 'Just now'}</p>
            </div>
            <div>
              <p className="text-white/40">WhatsApp Alerts</p>
              <p className="font-medium text-green-400">{user?.whatsappEnabled ? '✓ Enabled' : '✗ Disabled'}</p>
            </div>
            <div>
              <p className="text-white/40">Account Status</p>
              <p className="font-medium text-green-400">{user?.isActive ? '✓ Active' : '✗ Inactive'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
