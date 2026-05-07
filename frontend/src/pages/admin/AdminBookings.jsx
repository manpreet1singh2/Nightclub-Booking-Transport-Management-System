import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const STATUS_OPTS = ['all','pending','confirmed','cancelled','completed','no_show'];
const STATUS_CLR = {
  confirmed: 'text-green-400 bg-green-400/10',
  pending:   'text-yellow-400 bg-yellow-400/10',
  cancelled: 'text-red-400 bg-red-400/10',
  completed: 'text-neon-purple bg-neon-purple/10',
  no_show:   'text-white/40 bg-white/5',
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all');
  const [search, setSearch]     = useState('');
  const [page, setPage]         = useState(1);
  const [pagination, setPagination] = useState({});
  const [updating, setUpdating] = useState(null);
  const [exporting, setExporting] = useState(false);

  const fetch = () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 15 });
    if (filter !== 'all') params.set('status', filter);
    if (search) params.set('search', search);
    api.get(`/bookings?${params}`)
      .then(({ data }) => { setBookings(data.bookings || []); setPagination(data.pagination || {}); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [filter, search, page]);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      toast.success('Status updated');
      fetch();
    } catch { toast.error('Update failed'); }
    finally { setUpdating(null); }
  };

  const exportExcel = async () => {
    setExporting(true);
    try {
      const resp = await api.get('/bookings/export/excel', { responseType: 'blob' });
      const url  = URL.createObjectURL(resp.data);
      const a    = document.createElement('a');
      a.href = url;
      a.download = `NightVibe_Bookings_${Date.now()}.xlsx`;
      a.click();
      toast.success('Excel exported!');
    } catch { toast.error('Export failed'); }
    finally { setExporting(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">Bookings</h1>
          <p className="text-white/40 text-sm mt-1">{pagination.total || 0} total bookings</p>
        </div>
        <button onClick={exportExcel} disabled={exporting}
          className="btn-gold text-sm px-4 py-2 disabled:opacity-50">
          {exporting ? '⏳ Exporting...' : '📊 Export Excel'}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input type="text" placeholder="Search by booking ID..."
          value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="input-field sm:max-w-xs" />
        <div className="flex gap-2 flex-wrap">
          {STATUS_OPTS.map((s) => (
            <button key={s} onClick={() => { setFilter(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                filter === s ? 'bg-neon-purple text-white' : 'glass-card text-white/60 hover:text-white'
              }`}>{s.replace('_', ' ')}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/3">
                {['Booking ID','Customer','Club','Date/Time','Guests','Transport','Amount','Status','Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-white/40 font-medium text-xs whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}><td colSpan={9} className="px-4 py-4"><div className="h-4 skeleton rounded" /></td></tr>
                ))
              ) : bookings.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-12 text-white/30">No bookings found</td></tr>
              ) : bookings.map((b) => (
                <tr key={b.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3 font-mono text-neon-purple text-xs whitespace-nowrap">{b.bookingId}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium">{b.user?.name}</div>
                    <div className="text-white/40 text-xs">{b.user?.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-white/70 whitespace-nowrap">{b.club?.name}</td>
                  <td className="px-4 py-3 text-white/60 whitespace-nowrap text-xs">
                    {new Date(b.visitDate + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    <br />{b.visitTime}
                  </td>
                  <td className="px-4 py-3 text-white/60 capitalize">{b.numberOfPeople} {b.guestType}</td>
                  <td className="px-4 py-3">
                    {b.transportType !== 'none'
                      ? <span className="text-xs text-gold-400 font-medium uppercase">{b.transportType}</span>
                      : <span className="text-xs text-white/30">—</span>}
                  </td>
                  <td className="px-4 py-3 font-semibold whitespace-nowrap">₹{parseFloat(b.totalAmount || 0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_CLR[b.status] || 'text-white/40 bg-white/5'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={b.status}
                      disabled={updating === b.id}
                      onChange={(e) => updateStatus(b.id, e.target.value)}
                      className="text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white/70 cursor-pointer hover:bg-white/10 transition-colors disabled:opacity-50"
                    >
                      {['pending','confirmed','cancelled','completed','no_show'].map((s) => (
                        <option key={s} value={s} style={{ background: '#0d0d2b' }}>{s.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
            <span className="text-xs text-white/40">
              Showing {((page-1)*15)+1}–{Math.min(page*15, pagination.total)} of {pagination.total}
            </span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
                className="px-3 py-1 text-xs glass-card disabled:opacity-30">← Prev</button>
              <button onClick={() => setPage(p => Math.min(pagination.pages, p+1))} disabled={page === pagination.pages}
                className="px-3 py-1 text-xs glass-card disabled:opacity-30">Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
