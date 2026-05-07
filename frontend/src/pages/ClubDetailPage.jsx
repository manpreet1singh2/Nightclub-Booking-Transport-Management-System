import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';

const PACKAGE_ICONS = {
  entry_only: '🎟️',
  entry_drinks: '🍹',
  entry_cab: '🚗',
  entry_bike: '🏍️',
  full_combo: '⭐',
};

export default function ClubDetailPage() {
  const { id } = useParams();
  const [club, setClub]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [imgIdx, setImgIdx]     = useState(0);

  useEffect(() => {
    api.get(`/clubs/${id}`).then(({ data }) => setClub(data.club)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <div className="glass-card p-12 text-center animate-pulse">
        <div className="text-5xl mb-4">🌙</div>
        <div className="h-4 skeleton rounded w-32 mx-auto" />
      </div>
    </div>
  );

  if (!club) return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <div className="text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-xl font-bold mb-2">Club not found</h2>
        <Link to="/clubs" className="btn-neon mt-4">Browse Clubs</Link>
      </div>
    </div>
  );

  const images = club.images?.length
    ? club.images
    : ['https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800'];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero image */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={images[imgIdx]} alt={club.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-hero-gradient" />

        {/* Image dots */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button key={i} onClick={() => setImgIdx(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === imgIdx ? 'bg-neon-purple w-6' : 'bg-white/30'}`}
              />
            ))}
          </div>
        )}

        <div className="absolute bottom-8 left-8">
          <h1 className="text-3xl md:text-5xl font-black drop-shadow-2xl">{club.name}</h1>
          <p className="text-white/70 mt-2">📍 {club.address}, {club.city}</p>
        </div>

        <div className="absolute top-8 right-8 flex gap-3">
          <div className="glass-card px-3 py-2 text-sm font-medium">
            ⭐ {club.rating} <span className="text-white/40">({club.totalReviews})</span>
          </div>
          <div className={`px-3 py-2 rounded-xl text-sm font-medium ${
            club.isActive
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-red-500/20 text-red-400'
          }`}>
            {club.isActive ? '🟢 Open Tonight' : '🔴 Closed'}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left */}
        <div className="lg:col-span-2 space-y-8">
          {/* About */}
          <div className="glass-card p-6">
            <h2 className="font-bold text-lg mb-3">About</h2>
            <p className="text-white/60 leading-relaxed">{club.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center glass-card-dark p-4 rounded-xl">
                <div className="text-2xl mb-1">👥</div>
                <div className="font-bold">{club.capacity}</div>
                <div className="text-xs text-white/40">Capacity</div>
              </div>
              <div className="text-center glass-card-dark p-4 rounded-xl">
                <div className="text-2xl mb-1">⏰</div>
                <div className="font-bold text-sm">{club.openTime?.slice(0,5)} – {club.closeTime?.slice(0,5)}</div>
                <div className="text-xs text-white/40">Hours</div>
              </div>
              <div className="text-center glass-card-dark p-4 rounded-xl">
                <div className="text-2xl mb-1">📍</div>
                <div className="font-bold">{club.city}</div>
                <div className="text-xs text-white/40">Location</div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="glass-card p-6">
            <h2 className="font-bold text-lg mb-4">Amenities</h2>
            <div className="flex flex-wrap gap-3">
              {(club.amenities || []).map((a) => (
                <span key={a} className="glass-card-dark px-4 py-2 rounded-xl text-sm text-white/70">✓ {a}</span>
              ))}
            </div>
          </div>

          {/* Packages */}
          <div>
            <h2 className="font-bold text-lg mb-5">Available Packages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {(club.packages || []).map((pkg) => (
                <div key={pkg.id} className={`glass-card p-6 border transition-all ${
                  pkg.type === 'full_combo'
                    ? 'border-gold-500/40 shadow-neon-gold'
                    : 'border-white/10 hover:border-neon-purple/30'
                }`}>
                  {pkg.type === 'full_combo' && (
                    <div className="text-xs font-bold text-gold-400 mb-2 uppercase tracking-wider">⭐ Best Value</div>
                  )}
                  <div className="text-2xl mb-2">{PACKAGE_ICONS[pkg.type] || '🎟️'}</div>
                  <h3 className="font-bold text-base mb-2">{pkg.name}</h3>
                  <p className="text-white/50 text-sm mb-4">{pkg.description}</p>
                  <div className="space-y-1.5 mb-5">
                    {(pkg.features || []).map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm text-white/60">
                        <span className="text-neon-purple">✓</span> {f}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-2xl font-black text-gold-400">₹{pkg.pricePerPerson}</div>
                      <div className="text-xs text-white/40">per person</div>
                      {pkg.priceCouple && (
                        <div className="text-xs text-white/50 mt-1">Couple: ₹{pkg.priceCouple}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Book CTA */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 sticky top-24">
            <h2 className="font-bold text-lg mb-2">Ready to Book?</h2>
            <p className="text-white/50 text-sm mb-6">
              Reserve your spot at {club.name}. Only 15% advance required.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-white/60">
                <span className="text-green-400">✓</span> Instant WhatsApp confirmation
              </div>
              <div className="flex items-center gap-3 text-sm text-white/60">
                <span className="text-green-400">✓</span> Transport booking available
              </div>
              <div className="flex items-center gap-3 text-sm text-white/60">
                <span className="text-green-400">✓</span> Free cancellation (T&C apply)
              </div>
              <div className="flex items-center gap-3 text-sm text-white/60">
                <span className="text-green-400">✓</span> Secure Razorpay payment
              </div>
            </div>

            <Link to={`/book/${club.id}`} className="btn-neon w-full py-4 text-center text-base">
              🎉 Book Now
            </Link>

            <div className="mt-4 text-center">
              <p className="text-xs text-white/30">
                Questions? Call us at{' '}
                <a href={`tel:${club.phone}`} className="text-neon-purple hover:underline">{club.phone}</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
