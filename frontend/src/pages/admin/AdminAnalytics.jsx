import { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import api from '../../utils/api';

const PERIOD_OPTS = [
  { value: '7',  label: '7 Days' },
  { value: '30', label: '30 Days' },
  { value: '90', label: '3 Months' },
];

export default function AdminAnalytics() {
  const [period, setPeriod]         = useState('30');
  const [daily, setDaily]           = useState([]);
  const [packages, setPkgData]      = useState([]);
  const [transports, setTransports] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/admin/analytics?period=${period}`).then(({ data }) => {
      setDaily((data.dailyBookings || []).map(r => ({
        date: new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        bookings: parseInt(r.count),
        revenue: Math.round(parseFloat(r.revenue || 0)),
      })));
      setPkgData((data.packagePopularity || []).map(r => ({
        name: r.package?.name || 'Unknown',
        count: parseInt(r.count),
      })));
      setTransports((data.transportStats || []).map(r => ({
        name: r.transportType === 'none' ? 'No Transport' : r.transportType.toUpperCase(),
        count: parseInt(r.count),
      })));
    }).finally(() => setLoading(false));
  }, [period]);

  const totalBookings = daily.reduce((s, d) => s + d.bookings, 0);
  const totalRevenue  = daily.reduce((s, d) => s + d.revenue, 0);
  const avgPerDay     = daily.length ? Math.round(totalBookings / daily.length) : 0;

  const chartTooltipStyle = {
    contentStyle: { background: 'rgba(13,13,43,0.95)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '12px', color: '#fff' },
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">Analytics</h1>
          <p className="text-white/40 text-sm mt-1">Business performance insights</p>
        </div>
        <div className="flex gap-2">
          {PERIOD_OPTS.map(({ value, label }) => (
            <button key={value} onClick={() => setPeriod(value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                period === value ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white' : 'glass-card text-white/60 hover:text-white'
              }`}>{label}</button>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-5 text-center border border-neon-purple/20">
          <div className="text-3xl font-black text-neon-purple">{totalBookings}</div>
          <div className="text-sm text-white/50 mt-1">Total Bookings</div>
        </div>
        <div className="glass-card p-5 text-center border border-gold-500/20">
          <div className="text-3xl font-black text-gold-400">₹{totalRevenue.toLocaleString('en-IN')}</div>
          <div className="text-sm text-white/50 mt-1">Revenue (advance paid)</div>
        </div>
        <div className="glass-card p-5 text-center border border-neon-pink/20">
          <div className="text-3xl font-black text-neon-pink">{avgPerDay}</div>
          <div className="text-sm text-white/50 mt-1">Avg. Bookings/Day</div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1,2].map(i => <div key={i} className="glass-card h-64 animate-pulse" />)}
        </div>
      ) : (
        <>
          {/* Bookings trend */}
          <div className="glass-card p-6">
            <h3 className="font-bold mb-5">📈 Bookings & Revenue Trend</h3>
            {daily.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={daily}>
                  <defs>
                    <linearGradient id="bGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="rGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left"  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip {...chartTooltipStyle} />
                  <Legend formatter={v => <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{v}</span>} />
                  <Area yAxisId="left"  type="monotone" dataKey="bookings" stroke="#a855f7" strokeWidth={2} fill="url(#bGrad2)" name="Bookings" />
                  <Area yAxisId="right" type="monotone" dataKey="revenue"  stroke="#fbbf24" strokeWidth={2} fill="url(#rGrad)"  name="Revenue (₹)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : <NoData />}
          </div>

          {/* Bottom charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Package popularity */}
            <div className="glass-card p-6">
              <h3 className="font-bold mb-5">🎟️ Package Popularity</h3>
              {packages.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={packages} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                    <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} />
                    <YAxis type="category" dataKey="name" width={110} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip {...chartTooltipStyle} />
                    <Bar dataKey="count" name="Bookings" fill="#a855f7" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <NoData />}
            </div>

            {/* Transport breakdown */}
            <div className="glass-card p-6">
              <h3 className="font-bold mb-5">🚗 Transport Breakdown</h3>
              {transports.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={transports}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} />
                    <Tooltip {...chartTooltipStyle} />
                    <Bar dataKey="count" name="Bookings" radius={[6,6,0,0]}>
                      {transports.map((_, i) => (
                        <rect key={i} fill={['#a855f7','#ff2d78','#6b7280'][i] || '#a855f7'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : <NoData />}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function NoData() {
  return <div className="h-48 flex items-center justify-center text-white/20 text-sm">No data for this period</div>;
}
