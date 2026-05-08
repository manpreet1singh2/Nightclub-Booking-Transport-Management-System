import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../utils/api';

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' },
  confirmed: { label: 'Confirmed', color: 'text-green-400 bg-green-400/10 border-green-400/30'   },
  cancelled: { label: 'Cancelled', color: 'text-red-400 bg-red-400/10 border-red-400/30'         },
  completed: { label: 'Completed', color: 'text-neon-purple bg-neon-purple/10 border-neon-purple/30' },
  no_show:   { label: 'No Show',   color: 'text-white/40 bg-white/5 border-white/10'             },
};

export default function MyBookingsPage() {
  const [bookings, setBookings]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState('all');
  const [cancelling, setCancelling] = useState(null);

  const fetchBookings = (f = filter) => {
    setLoading(true);
    const params = f !== 'all' ? `?status=${f}` : '';
    api.get(`/bookings/my-bookings${params}`)
      .then(({ data }) => setBookings(data.bookings || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(filter); }, [filter]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return;
    setCancelling(bookingId);
    // Demo: just update local state
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
    toast.success('Booking cancelled');
    setCancelling(null);
  };

  const FILTERS = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black">My Bookings</h1>
            <p className="text-white/50 mt-1">Your nightlife history</p>
          </div>
          <Link to="/clubs" className="btn-neon text-sm px-4 py-2">+ New Booking</Link>
        </div>

        <div className="flex gap-2 mb-8 flex-wrap">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                filter === f ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white' : 'glass-card text-white/60 hover:text-white'
              }`}>{f}</button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-20 h-20 skeleton rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 skeleton rounded w-1/2" />
                    <div className="h-4 skeleton rounded w-1/3" />
                    <div className="h-4 skeleton rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-24 glass-card">
            <div className="text-6xl mb-4">🎟️</div>
            <h3 className="text-xl font-bold mb-2">No bookings yet</h3>
            <p className="text-white/50 mb-6">Start your nightlife journey today!</p>
            <Link to="/clubs" className="btn-neon px-6 py-3">Browse Clubs</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b, i) => {
              const status = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending;
              return (
                <motion.div key={b.id || i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-6"
                >
                  <div className="flex gap-4">
                    <img
                      src={b.club?.images?.[0] || 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=200'}
                      alt={b.club?.name}
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=200'; }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-bold text-base">{b.club?.name || 'Club'}</h3>
                          <p className="text-neon-purple text-xs font-mono">{b.bookingId}</p>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-xs text-white/50">
                        <span>📅 {b.visitDate ? new Date(b.visitDate + 'T00:00:00').toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : '—'}</span>
                        <span>⏰ {b.visitTime || '—'}</span>
                        <span>👥 {b.numberOfPeople} {b.guestType}</span>
                        <span>💰 ₹{parseFloat(b.totalAmount || 0).toLocaleString('en-IN')}</span>
                        {b.package && <span>🎟️ {b.package.name}</span>}
                        {b.transportType && b.transportType !== 'none' && <span>🚗 {b.transportType}</span>}
                        {b.payment && (
                          <span className={b.payment.status === 'captured' ? 'text-green-400' : 'text-yellow-400'}>
                            💳 {b.payment.status === 'captured' ? 'Paid' : 'Pending'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {['pending','confirmed'].includes(b.status) && (
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
                      <button
                        onClick={() => handleCancel(b.id)}
                        disabled={cancelling === b.id}
                        className="text-sm text-red-400 hover:text-red-300 border border-red-400/20 px-4 py-1.5 rounded-lg hover:bg-red-400/10 transition-colors disabled:opacity-50"
                      >
                        {cancelling === b.id ? 'Cancelling...' : 'Cancel Booking'}
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
