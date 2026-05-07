import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';

const NAV_LINKS = [
  { to: '/',       label: 'Home' },
  { to: '/clubs',  label: 'Clubs' },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [userMenu, setUserMenu]   = useState(false);
  const { user, token, logout, isAdmin } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenu(false);
    navigate('/');
  };

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-night-950/90 backdrop-blur-xl border-b border-white/5 shadow-2xl' : 'bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center text-lg font-bold shadow-neon-purple group-hover:scale-110 transition-transform">
            🌙
          </div>
          <span className="font-bold text-xl tracking-tight">
            Night<span className="gradient-text">Vibe</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-200 ${
                  isActive ? 'text-neon-purple' : 'text-white/70 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          {isAdmin() && (
            <NavLink to="/admin"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-200 ${isActive ? 'text-gold-400' : 'text-white/70 hover:text-gold-400'}`
              }
            >
              Admin
            </NavLink>
          )}
        </div>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-3">
          {token ? (
            <div className="relative">
              <button
                onClick={() => setUserMenu(!userMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card hover:bg-white/10 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center text-xs font-bold">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-medium">{user?.name?.split(' ')[0]}</span>
                <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {userMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 glass-card-dark border border-white/10 shadow-2xl overflow-hidden"
                  >
                    <Link to="/my-bookings" onClick={() => setUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors">
                      🎟️ My Bookings
                    </Link>
                    <Link to="/profile" onClick={() => setUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors">
                      👤 Profile
                    </Link>
                    <hr className="border-white/10" />
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-neon-pink hover:bg-white/5 transition-colors">
                      🚪 Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-outline text-sm px-4 py-2">Login</Link>
              <Link to="/register" className="btn-neon text-sm px-4 py-2">Sign Up Free</Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg glass-card"
        >
          <div className={`w-5 h-0.5 bg-white transition-all mb-1 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <div className={`w-5 h-0.5 bg-white transition-all mb-1 ${menuOpen ? 'opacity-0' : ''}`} />
          <div className={`w-5 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-night-950/95 backdrop-blur-xl border-t border-white/5"
          >
            <div className="px-4 py-4 space-y-2">
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink key={to} to={to} onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all"
                >
                  {label}
                </NavLink>
              ))}
              {token ? (
                <>
                  <Link to="/my-bookings" onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5">
                    🎟️ My Bookings
                  </Link>
                  <button onClick={handleLogout}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-neon-pink hover:bg-white/5">
                    🚪 Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-outline flex-1 text-sm py-2 text-center">Login</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-neon flex-1 text-sm py-2 text-center">Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
