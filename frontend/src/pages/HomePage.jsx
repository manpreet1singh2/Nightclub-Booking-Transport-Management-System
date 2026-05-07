import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';

const STATS = [
  { label: 'Active Clubs',  value: '50+',  icon: '🏠' },
  { label: 'Happy Guests',  value: '10K+', icon: '🎉' },
  { label: 'Cities',        value: '8',    icon: '📍' },
  { label: 'Safe Rides',    value: '2K+',  icon: '🚗' },
];

const FEATURES = [
  { icon: '🎟️', title: 'Instant Booking',    desc: 'Book your table or entry in under 2 minutes with our streamlined flow.' },
  { icon: '🚗', title: 'Transport Package',   desc: 'Add a safe cab or bike ride to your booking — no more surge pricing worries.' },
  { icon: '💬', title: 'WhatsApp Confirm',    desc: 'Instant confirmation on WhatsApp with your digital ticket & booking ID.' },
  { icon: '💳', title: 'Secure Payments',     desc: 'Pay safely via UPI, card, or wallet through Razorpay. Only 15% advance needed.' },
  { icon: '🍹', title: 'Drink Packages',      desc: 'Pre-book complimentary drinks and skip the bar queue all night long.' },
  { icon: '📊', title: 'Admin Dashboard',     desc: 'Full control panel for club owners — bookings, transport, analytics & exports.' },
];

// Floating particle
function Particle({ style }) {
  return (
    <div className="absolute rounded-full opacity-20 particle pointer-events-none" style={style} />
  );
}

export default function HomePage() {
  const [clubs, setClubs]           = useState([]);
  const [loadingClubs, setLoadingClubs] = useState(true);

  useEffect(() => {
    api.get('/clubs?limit=3').then(({ data }) => {
      setClubs(data.clubs || []);
    }).finally(() => setLoadingClubs(false));
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* ─── HERO ──────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-4 pt-16">
        {/* Particles */}
        {[...Array(8)].map((_, i) => (
          <Particle key={i} style={{
            width:  `${6 + (i * 4)}px`,
            height: `${6 + (i * 4)}px`,
            top:    `${10 + (i * 10)}%`,
            left:   `${5 + (i * 12)}%`,
            background: i % 2 === 0
              ? 'radial-gradient(circle, #a855f7, transparent)'
              : 'radial-gradient(circle, #ff2d78, transparent)',
            animationDuration: `${4 + i}s`,
            animationDelay: `${i * 0.5}s`,
          }} />
        ))}

        {/* Glow orbs */}
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-neon-purple/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-neon-pink/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium text-neon-purple border border-neon-purple/30 mb-6">
              <span className="w-2 h-2 rounded-full bg-neon-purple animate-pulse" />
              India's #1 Nightclub Booking Platform
            </span>

            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
              Book Your
              <span className="block gradient-text">Perfect Night Out</span>
            </h1>

            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Premium clubs. Seamless bookings. Safe transport.
              Experience the night like never before — all in one platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/clubs" className="btn-neon text-lg px-8 py-4">
                🎉 Browse Clubs
              </Link>
              <Link to="/register" className="btn-outline text-lg px-8 py-4">
                Get Started Free →
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {STATS.map(({ label, value, icon }) => (
              <div key={label} className="glass-card p-5 text-center">
                <div className="text-2xl mb-1">{icon}</div>
                <div className="text-2xl font-black text-white">{value}</div>
                <div className="text-xs text-white/50 mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── FEATURED CLUBS ────────────────────────────────────────── */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="section-title">Featured Clubs</h2>
          <p className="section-subtitle">Handpicked premium venues across India</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loadingClubs
            ? [...Array(3)].map((_, i) => (
                <div key={i} className="glass-card overflow-hidden animate-pulse">
                  <div className="h-56 skeleton rounded-t-2xl" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 skeleton rounded w-3/4" />
                    <div className="h-4 skeleton rounded w-1/2" />
                    <div className="h-10 skeleton rounded" />
                  </div>
                </div>
              ))
            : clubs.map((club, i) => (
                <motion.div
                  key={club.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="club-card glass-card overflow-hidden group"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={club.images?.[0] || 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=600'}
                      alt={club.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-hero-gradient" />
                    <div className="absolute top-4 right-4 flex items-center gap-1 glass-card px-2 py-1 text-xs">
                      <span>⭐</span>
                      <span className="font-semibold">{club.rating || '4.8'}</span>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="text-xs text-white/70 glass-card px-2 py-1">
                        📍 {club.city}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-1">{club.name}</h3>
                    <p className="text-white/50 text-sm mb-4 line-clamp-2">{club.description}</p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {(club.amenities || []).slice(0, 3).map((a) => (
                        <span key={a} className="text-xs glass-card px-2 py-1 text-white/60">{a}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-white/40">Packages from</span>
                        <div className="text-gold-400 font-bold">
                          ₹{club.packages?.[0]?.pricePerPerson || '800'}/person
                        </div>
                      </div>
                      <Link to={`/clubs/${club.id}`} className="btn-neon text-sm px-4 py-2">
                        Book Now →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
          }
        </div>

        <div className="text-center mt-12">
          <Link to="/clubs" className="btn-outline px-8 py-3">View All Clubs</Link>
        </div>
      </section>

      {/* ─── HOW IT WORKS ──────────────────────────────────────────── */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-purple/5 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Book your night in 4 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-12 left-1/8 right-1/8 h-0.5 bg-gradient-to-r from-neon-purple/0 via-neon-purple/50 to-neon-purple/0 pointer-events-none" />

            {[
              { step: '01', icon: '🏠', title: 'Pick a Club',       desc: 'Browse our curated list of premium nightclubs.' },
              { step: '02', icon: '📅', title: 'Choose Package',    desc: 'Select date, time, guests, and your preferred package.' },
              { step: '03', icon: '🚗', title: 'Add Transport',     desc: 'Optionally add a safe cab or bike ride to your booking.' },
              { step: '04', icon: '✅', title: 'Pay & Party',       desc: 'Pay 15% advance online and get your WhatsApp ticket.' },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="glass-card p-6 text-center relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gradient-to-r from-neon-purple to-neon-pink rounded-full text-xs font-bold">
                  {step}
                </div>
                <div className="text-4xl mb-4 mt-2">{icon}</div>
                <h3 className="font-bold mb-2">{title}</h3>
                <p className="text-white/50 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ──────────────────────────────────────────────── */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="section-title">Everything You Need</h2>
          <p className="section-subtitle">A complete nightlife management ecosystem</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-6 group hover:border-neon-purple/30 transition-all"
            >
              <div className="w-12 h-12 rounded-xl glass-card-dark flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                {icon}
              </div>
              <h3 className="font-bold mb-2">{title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── CTA BANNER ─────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center glass-card p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-4">Ready to Experience the Night?</h2>
            <p className="text-white/60 text-lg mb-8">Join 10,000+ nightlife lovers who book smarter with NightVibe.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-gold text-lg px-8 py-4">
                🎉 Create Free Account
              </Link>
              <Link to="/clubs" className="btn-outline text-lg px-8 py-4">
                Browse Clubs →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
