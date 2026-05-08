import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useAuthStore } from '../../store/authStore';

const ROLE_CLR = {
  customer:    'text-white/60 bg-white/5 border-white/10',
  club_owner:  'text-neon-purple bg-neon-purple/10 border-neon-purple/20',
  super_admin: 'text-gold-400 bg-gold-400/10 border-gold-400/20',
};

export default function AdminUsers() {
  const { isSuperAdmin } = useAuthStore();
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  useEffect(() => {
    api.get('/admin/users')
      .then(({ data }) => setUsers(data.users || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = async (user) => {
    if (user.role === 'super_admin') { toast.error('Cannot deactivate super admin'); return; }
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isActive: !u.isActive } : u));
    toast.success(`User ${user.isActive ? 'deactivated' : 'activated'}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Users</h1>
        <p className="text-white/40 text-sm mt-1">{filtered.length} users</p>
      </div>

      <input type="text" placeholder="Search by name or email..."
        value={search} onChange={e => setSearch(e.target.value)}
        className="input-field max-w-sm" />

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/3">
                {['Name','Email','Phone','Role','Joined','Status','Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-white/40 font-medium text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}><td colSpan={7} className="px-4 py-4"><div className="h-4 skeleton rounded" /></td></tr>
                ))
              ) : filtered.map(user => (
                <tr key={user.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {user.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/60 text-xs">{user.email}</td>
                  <td className="px-4 py-3 text-white/60 whitespace-nowrap">+91{user.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium border capitalize ${ROLE_CLR[user.role] || ''}`}>
                      {user.role?.replace('_',' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/40 text-xs whitespace-nowrap">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'2-digit' }) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${user.isActive ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleStatus(user)}
                      disabled={user.role === 'super_admin'}
                      className={`text-xs px-3 py-1 rounded-lg border transition-colors disabled:opacity-30 ${
                        user.isActive
                          ? 'border-red-400/30 text-red-400 hover:bg-red-400/10'
                          : 'border-green-400/30 text-green-400 hover:bg-green-400/10'
                      }`}>
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
