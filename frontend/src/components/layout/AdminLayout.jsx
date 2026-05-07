import { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const MENU = [
  { to: '/admin',           label: 'Dashboard',   icon: '📊', exact: true },
  { to: '/admin/bookings',  label: 'Bookings',    icon: '🎟️' },
  { to: '/admin/transport', label: 'Transport',   icon: '🚗' },
  { to: '/admin/clubs',     label: 'Clubs',       icon: '🏠' },
  { to: '/admin/users',     label: 'Users',       icon: '👥' },
  { to: '/admin/analytics', label: 'Analytics',   icon: '📈' },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen flex bg-night-950">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-64'} flex-shrink-0 transition-all duration-300 flex flex-col border-r border-white/5 bg-black/30 backdrop-blur-xl`}>
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-white/5">
          {!collapsed && (
            <Link to="/" className="font-bold text-lg">
              Night<span className="gradient-text">Vibe</span>
              <span className="ml-2 text-xs text-gold-400 font-normal">Admin</span>
            </Link>
          )}
          {collapsed && <span className="text-xl mx-auto">🌙</span>}
          <button onClick={() => setCollapsed(!collapsed)}
            className="ml-auto p-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={collapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'} />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {MENU.map(({ to, label, icon, exact }) => (
            <NavLink key={to} to={to} end={exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/30' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <span className="text-base">{icon}</span>
              {!collapsed && label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-white/5">
          {!collapsed && (
            <div className="px-3 py-2 mb-2">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-white/40 capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
          )}
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/50 hover:text-neon-pink hover:bg-white/5 transition-all">
            <span>🚪</span>
            {!collapsed && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-screen overflow-auto">
        <header className="h-16 flex items-center px-8 border-b border-white/5 bg-black/10 backdrop-blur-sm">
          <h1 className="text-white/80 font-medium text-sm">
            Welcome back, <span className="text-white font-semibold">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <div className="ml-auto flex items-center gap-3">
            <Link to="/" className="text-xs text-white/40 hover:text-white transition-colors">← View Site</Link>
          </div>
        </header>
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
