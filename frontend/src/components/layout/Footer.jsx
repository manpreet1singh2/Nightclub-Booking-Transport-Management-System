import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-night-950/80 backdrop-blur-xl mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center text-xl font-bold">
                🌙
              </div>
              <span className="font-bold text-xl">Night<span className="gradient-text">Vibe</span></span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Premium nightlife booking & transport management platform. Book your dream night out in seconds.
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              {[
                { icon: '𝕏', href: 'https://twitter.com/nightvibe', label: 'Twitter' },
                { icon: '📸', href: 'https://instagram.com/nightvibe', label: 'Instagram' },
                { icon: '💼', href: 'https://linkedin.com/company/nightvibe', label: 'LinkedIn' },
              ].map(({ icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 glass-card flex items-center justify-center text-lg hover:bg-white/10 transition-all hover:scale-110">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/clubs', label: 'Browse Clubs' },
                { to: '/my-bookings', label: 'My Bookings' },
                { to: '/register', label: 'Create Account' },
                { to: '/login', label: 'Login' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-white/50 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-neon-purple opacity-0 group-hover:opacity-100 transition-opacity" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Services</h4>
            <ul className="space-y-3 text-white/50 text-sm">
              {[
                '🎟️ Club Entry Booking',
                '🍹 Drinks Packages',
                '🚗 Cab Transport',
                '🏍️ Bike Rides',
                '🪑 Table Reservations',
                '📊 Admin Dashboard',
              ].map((item) => (
                <li key={item} className="hover:text-white/80 transition-colors cursor-default">{item}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm">
                <span className="text-neon-purple">📍</span>
                <span className="text-white/50">Level 3, Cyber Hub,<br />Gurugram, Haryana 122002</span>
              </li>
              <li className="flex gap-3 text-sm">
                <span className="text-neon-purple">📞</span>
                <a href="tel:+919876543210" className="text-white/50 hover:text-white transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex gap-3 text-sm">
                <span className="text-neon-purple">📧</span>
                <a href="mailto:hello@nightvibe.in" className="text-white/50 hover:text-white transition-colors">
                  hello@nightvibe.in
                </a>
              </li>
              <li className="flex gap-3 text-sm">
                <span className="text-neon-purple">💬</span>
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
                  className="text-white/50 hover:text-green-400 transition-colors">
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} NightVibe. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-white/30">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white/60 transition-colors">Refund Policy</a>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/30">
            <span>Payments secured by</span>
            <span className="text-blue-400 font-semibold">Razorpay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
