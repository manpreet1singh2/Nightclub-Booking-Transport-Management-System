import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';

const CITIES = ['All', 'Mumbai', 'New Delhi', 'Gurugram', 'Bangalore', 'Pune', 'Hyderabad'];

export default function ClubsPage() {
  const [clubs, setClubs]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [city, setCity]         = useState('All');
  const [page, setPage]         = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 9 });
    if (search) params.set('search', search);
    if (city !== 'All') params.set('city', city);

    api.get(`/clubs?${params}`).then(({ data }) => {
      setClubs(data.clubs || []);
      setPagination(data.pagination || {});
    }).finally(() => setLoading(false));
  }, [search, city, page]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-title">Browse Clubs</h1>
          <p className="section-subtitle">Find your perfect nightlife destination</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search clubs..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input-field pl-11"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CITIES.map((c) => (
              <button key={c} onClick={() => { setCity(c); setPage(1); }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  city === c
                    ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white'
                    : 'glass-card text-white/60 hover:text-white hover:bg-white/10'
                }`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card overflow-hidden animate-pulse">
                <div className="h-56 skeleton" />
                <div className="p-6 space-y-3">
                  <div className="h-5 skeleton rounded w-3/4" />
                  <div className="h-4 skeleton rounded w-full" />
                  <div className="h-10 skeleton rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : clubs.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">No clubs found</h3>
            <p className="text-white/50">Try a different city or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clubs.map((club, i) => (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="club-card glass-card overflow-hidden group"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={club.images?.[0] || `https://images.unsplash.com/photo-${1566737236500 + i}-c8ac43014a67?w=600`}
                    alt={club.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=600'; }}
                  />
                  <div className="absolute inset-0 bg-hero-gradient" />
                  <div className="absolute top-4 right-4 glass-card px-2 py-1 text-xs flex items-center gap-1">
                    ⭐ <span className="font-bold">{club.rating || '4.8'}</span>
                    <span className="text-white/40">({club.totalReviews || 0})</span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      club.isActive ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {club.isActive ? '🟢 Open' : '🔴 Closed'}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="text-sm text-white font-semibold drop-shadow-lg">📍 {club.city}</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-lg mb-1">{club.name}</h3>
                  <p className="text-white/50 text-sm mb-4 line-clamp-2">{club.description}</p>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {(club.amenities || []).slice(0, 3).map((a) => (
                      <span key={a} className="text-xs glass-card px-2 py-1 text-white/60 rounded-lg">{a}</span>
                    ))}
                  </div>

                  {/* Time */}
                  {club.openTime && (
                    <div className="flex items-center gap-2 text-xs text-white/40 mb-4">
                      <span>⏰</span>
                      <span>{club.openTime?.slice(0,5)} — {club.closeTime?.slice(0,5)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-white/40">Starting from</div>
                      <div className="text-gold-400 font-bold text-lg">
                        ₹{club.packages?.[0]?.pricePerPerson || '800'}
                        <span className="text-xs font-normal text-white/40">/person</span>
                      </div>
                    </div>
                    <Link to={`/clubs/${club.id}`} className="btn-neon text-sm px-5 py-2.5">
                      Book Now →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
              className="btn-outline px-4 py-2 text-sm disabled:opacity-30 disabled:cursor-not-allowed">
              ← Prev
            </button>
            <span className="flex items-center px-4 py-2 text-sm text-white/60">
              Page {page} of {pagination.pages}
            </span>
            <button onClick={() => setPage(p => Math.min(pagination.pages, p+1))} disabled={page === pagination.pages}
              className="btn-outline px-4 py-2 text-sm disabled:opacity-30 disabled:cursor-not-allowed">
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
