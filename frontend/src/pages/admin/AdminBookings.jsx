import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const STATUS_CLR = {
  confirmed: 'text-green-400 bg-green-400/10',
  pending:   'text-yellow-400 bg-yellow-400/10',
  cancelled: 'text-red-400 bg-red-400/10',
  completed: 'text-neon-purple bg-neon-purple/10',
  no_show:   'text-white/40 bg-white/5',
};

export default function AdminBookings() {
  const [bookings, setBookings]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState('all');
  const [search, setSearch]         = useState('');
  const [exporting, setExporting]   = useState(false);

  const STATUS_OPTS = ['all','pending','confirmed','cancelled','completed','no_show'];

  const fetch = () => {
    setLoading(true);
    api.get('/bookings/my-bookings')
      .then(({ data }) => setBookings(data.bookings || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const filtered = bookings.filter(b => {
    const matchStatus = filter === 'all' || b.status === filter;
    const matchSearch = !search || b.bookingId?.toLowerCase().includes(search.toLowerCase())
      || b.club?.name?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const updateStatus = (id, status) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    toast.success('Status updated');
  };

  const exportCSV = () => {
    setExporting(true);
    const headers = ['Booking ID','Club','Date','Time','Guests','Transport','Total','Status'];
    const rows = filtered.map(b => [
      b.bookingId, b.club?.name || '', b.visitDate, b.visitTime,
      `${b.numberOfPeople} ${b.guestType}`, b.transportType,
      `₹${b.totalAmount}`, b.status
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `NightVibe_Bookings_${Date.now()}.csv`;
    a.click();
    toast.success('CSV exported!');
    setExporting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">Bookings</h1>
          <p className="text-white/40 text-sm mt-1">{filtered.length} bookings</p>
        </div>
        <button onClick={exportCSV} disabled={exporting} className="btn-gold text-sm px-4 py-2 disabled:opacity-50">
          {exporting ? '⏳ Exporting...' : '📊 Export CSV'}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input type="text" placeholder="Search by booking ID or club..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="input-field sm:max-w-xs" />
        <div className="flex gap-2 flex-wrap">
          {STATUS_OPTS.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                filter === s ? 'bg-neon-purple text-white' : 'glass-card text-white/60 hover:text-white'
              }`}>{s.replace('_',' ')}</button>
          ))}
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/3">
                {['Booking ID','Club','Date','Guests','Transport','Amount','Status','Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-white/40 font-medium text-xs whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                [...Array(4)].map((_,i) => (
                  <tr key={i}><td colSpan={8} className="px-4 py-4"><div className="h-4 skeleton rounded" /></td></tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-white/30">No bookings found</td></tr>
              ) : filtered.map(b => (
                <tr key={b.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3 font-mono text-neon-purple text-xs whitespace-nowrap">{b.bookingId}</td>
                  <td className="px-4 py-3 text-white/70 whitespace-nowrap">{b.club?.name || '—'}</td>
                  <td className="px-4 py-3 text-white/60 whitespace-nowrap text-xs">
                    {b.visitDate}<br/>{b.visitTime}
                  </td>
                  <td className="px-4 py-3 text-white/60 capitalize">{b.numberOfPeople} {b.guestType}</td>
                  <td className="px-4 py-3">
                    {b.transportType && b.transportType !== 'none'
                      ? <span className="text-xs text-gold-400 font-medium uppercase">{b.transportType}</span>
                      : <span className="text-xs text-white/30">—</span>}
                  </td>
                  <td className="px-4 py-3 font-semibold whitespace-nowrap">₹{parseFloat(b.totalAmount||0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_CLR[b.status] || 'text-white/40 bg-white/5'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select value={b.status} onChange={e => updateStatus(b.id, e.target.value)}
                      className="text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white/70 cursor-pointer hover:bg-white/10 transition-colors">
                      {['pending','confirmed','cancelled','completed','no_show'].map(s => (
                        <option key={s} value={s} style={{background:'#0d0d2b'}}>{s.replace('_',' ')}</option>
                      ))}
                    </select>
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
