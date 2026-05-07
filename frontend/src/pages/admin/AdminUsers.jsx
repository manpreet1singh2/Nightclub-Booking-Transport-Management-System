import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useAuthStore } from '../../store/authStore';

const ROLE_CLR = { customer: 'text-white/60 bg-white/5', club_owner: 'text-neon-purple bg-neon-purple/10', super_admin: 'text-gold-400 bg-gold-400/10' };

export default function AdminUsers() {
  const { isSuperAdmin } = useAuthStore();
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage]           = useState(1);
  const [pagination, setPagination] = useState({});
  const [toggling, setToggling]   = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 15 });
    if (search) params.set('search', search);
    if (roleFilter !== 'all') params.set('role', roleFilter);
    api.get(`/admin/users?${params}`)
      .then(({ data }) => { setUsers(data.users || []); setPagination(data.pagination || {}); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [search, roleFilter, page]);

  const toggleStatus = async (user) => {
    setToggling(user.id);
    try {
      await api.patch(`/admin/users/${user.id}/status`);
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'}`);
      fetchUsers();
    } catch { toast.error('Failed'); }
    finally { setToggling(null); }
  };

  if (!isSuperAdmin()) return (
    <div className="text-center py-24">
      <div className="text-5xl mb-4">🔒</div>
      <p className="text-white/50">Super Admin access required</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Users</h1>
        <p className="text-white/40 text-sm mt-1">{pagination.total || 0} registered users</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input type="text" placeholder="Search by name or email..."
          value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="input-field sm:max-w-xs" />
        <div className="flex gap-2">
          {['all','customer','club_owner','super_admin'].map(r => (
            <button key={r} onClick={() => { setRoleFilter(r); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                roleFilter === r ? 'bg-neon-purple text-white' : 'glass-card text-white/60 hover:text-white'
              }`}>{r.replace('_', ' ')}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/3">
                {['Name','Email','Phone','Role','Joined','Status','Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-white/40 font-medium text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}><td colSpan={7} className="px-4 py-4"><div className="h-4 skeleton rounded" /></td></tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-white/30">No users found</td></tr>
              ) : users.map(user => (
                <tr key={user.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {user.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="font-medium whitespace-nowrap">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/60 text-xs">{user.email}</td>
                  <td className="px-4 py-3 text-white/60 whitespace-nowrap">+91{user.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${ROLE_CLR[user.role] || 'text-white/40 bg-white/5'}`}>
                      {user.role?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/40 text-xs whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${user.isActive ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleStatus(user)}
                      disabled={toggling === user.id || user.role === 'super_admin'}
                      className={`text-xs px-3 py-1 rounded-lg border transition-colors disabled:opacity-30 ${
                        user.isActive
                          ? 'border-red-400/30 text-red-400 hover:bg-red-400/10'
                          : 'border-green-400/30 text-green-400 hover:bg-green-400/10'
                      }`}
                    >
                      {toggling === user.id ? '...' : user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
            <span className="text-xs text-white/40">Page {page} of {pagination.pages}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="px-3 py-1 text-xs glass-card disabled:opacity-30">← Prev</button>
              <button onClick={() => setPage(p => Math.min(pagination.pages, p+1))} disabled={page === pagination.pages} className="px-3 py-1 text-xs glass-card disabled:opacity-30">Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
