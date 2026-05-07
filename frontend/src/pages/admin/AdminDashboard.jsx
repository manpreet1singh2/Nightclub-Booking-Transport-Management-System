import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import api from '../../utils/api';

const StatCard = ({ icon, label, value, sub, color = 'purple' }) => {
  const colors = {
    purple: 'from-neon-purple/20 to-neon-purple/5 border-neon-purple/20',
    pink:   'from-neon-pink/20 to-neon-pink/5 border-neon-pink/20',
    gold:   'from-gold-500/20 to-gold-500/5 border-gold-500/20',
    green:  'from-green-500/20 to-green-500/5 border-green-500/20',
  };
  return (
    <div className={`glass-card p-5 border bg-gradient-to-br ${colors[color]}`}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        {sub && <span className="text-xs text-white/40">{sub}</span>}
      </div>
      <div className="text-2xl font-black">{value}</div>
      <div className="text-sm text-white/50 mt-1">{label}</div>
    </div>
  );
};

const STATUS_COLORS = {
  confirmed: '#a855f7', pending: '#fbbf24',
  cancelled: '#ff2d78', completed: '#22c55e', no_show: '#6b7280',
};

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null);
  const [recent, setRecent] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData]     = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/dashboard'),
      api.get('/admin/analytics?period=7'),
    ]).then(([dashRes, analyticsRes]) => {
      const d = dashRes.data;
      setStats(d.stats);
      setRecent(d.recentBookings || []);
      setChartData((analyticsRes.data.dailyBookings || []).map((r) => ({
        date: new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        bookings: parseInt(r.count),
        revenue: Math.round(parseFloat(r.revenue || 0)),
      })));
      setPieData((d.statusBreakdown || []).map((r) => ({
        name: r.status, value: parseInt(r.count),
        color: STATUS_COLORS[r.status] || '#6b7280',
      })));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map((i) => <div key={i} className="h-28 skeleton rounded-2xl" />)}
      </div>
      <div className="h-64 skeleton rounded-2xl" />
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="🎟️" label="Total Bookings" value={stats?.totalBookings?.toLocaleString() || 0} color="purple" />
        <StatCard icon="📅" label="Today's Bookings" value={stats?.todayBookings || 0} color="pink" />
        <StatCard icon="💰" label="Total Revenue" value={`₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`} sub="All time" color="gold" />
        <StatCard icon="🚗" label="Pending Transports" value={stats?.pendingTransports || 0} color="green" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📆" label="Month Bookings" value={stats?.monthBookings || 0} color="purple" />
        <StatCard icon="💵" label="Month Revenue" value={`₹${(stats?.monthRevenue || 0).toLocaleString('en-IN')}`} color="gold" />
        <StatCard icon="👥" label="Total Users" value={stats?.totalUsers?.toLocaleString() || 0} color="pink" />
        <StatCard icon="🏠" label="Active Clubs" value={stats?.activeClubs || 0} color="green" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="font-bold mb-5">📈 Bookings — Last 7 Days</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="bGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'rgba(13,13,43,0.95)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '12px', color: '#fff' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="bookings" stroke="#a855f7" strokeWidth={2} fill="url(#bGrad)" name="Bookings" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-white/30 text-sm">No data yet</div>
          )}
        </div>

        {/* Pie chart */}
        <div className="glass-card p-6">
          <h3 className="font-bold mb-5">🟣 Booking Status</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'rgba(13,13,43,0.95)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '12px', color: '#fff' }} />
                <Legend formatter={(v) => <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-white/30 text-sm">No data yet</div>
          )}
        </div>
      </div>

      {/* Recent bookings */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold">🕐 Recent Bookings</h3>
          <Link to="/admin/bookings" className="text-sm text-neon-purple hover:text-neon-pink transition-colors">View All →</Link>
        </div>

        {recent.length === 0 ? (
          <p className="text-white/40 text-sm text-center py-8">No bookings yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-white/40 text-left">
                  <th className="pb-3 font-medium">Booking ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Club</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recent.map((b) => (
                  <tr key={b.id} className="hover:bg-white/2 transition-colors">
                    <td className="py-3 font-mono text-neon-purple text-xs">{b.bookingId}</td>
                    <td className="py-3">
                      <div className="font-medium">{b.user?.name}</div>
                      <div className="text-white/40 text-xs">{b.user?.phone}</div>
                    </td>
                    <td className="py-3 text-white/70">{b.club?.name}</td>
                    <td className="py-3 text-white/50">{new Date(b.visitDate + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        b.status === 'confirmed' ? 'text-green-400 bg-green-400/10' :
                        b.status === 'pending'   ? 'text-yellow-400 bg-yellow-400/10' :
                        b.status === 'cancelled' ? 'text-red-400 bg-red-400/10' :
                        'text-white/40 bg-white/5'
                      }`}>{b.status}</span>
                    </td>
                    <td className="py-3 font-semibold">₹{parseFloat(b.totalAmount || 0).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { to: '/admin/bookings', icon: '🎟️', label: 'Manage Bookings' },
          { to: '/admin/transport', icon: '🚗', label: 'Transport Board' },
          { to: '/admin/clubs', icon: '🏠', label: 'Club Settings' },
          { to: '/admin/analytics', icon: '📈', label: 'Full Analytics' },
        ].map(({ to, icon, label }) => (
          <Link key={to} to={to} className="glass-card p-4 text-center hover:bg-white/5 transition-all group">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{icon}</div>
            <div className="text-sm font-medium text-white/70 group-hover:text-white">{label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
