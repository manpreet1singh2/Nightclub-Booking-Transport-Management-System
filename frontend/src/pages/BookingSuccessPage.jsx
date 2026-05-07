import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function BookingSuccessPage() {
  const { state } = useLocation();
  const booking   = state?.booking;

  if (!booking) return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <div className="text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold mb-4">Booking Confirmed!</h1>
        <Link to="/my-bookings" className="btn-neon">View My Bookings</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 pb-16">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-neon-purple/20 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Success card */}
        <div className="glass-card p-8 text-center border border-neon-purple/30 shadow-neon-purple">
          {/* Animated checkmark */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center text-4xl mx-auto mb-6 shadow-neon-purple"
          >
            🎉
          </motion.div>

          <h1 className="text-3xl font-black mb-2">You're All Set!</h1>
          <p className="text-white/60 mb-8">Your booking is confirmed. WhatsApp ticket sent! 📱</p>

          {/* Ticket */}
          <div className="glass-card-dark rounded-2xl p-6 mb-8 border border-white/10 text-left">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-white/50">Booking ID</span>
              <span className="font-bold text-neon-purple text-lg tracking-wider">{booking.bookingId}</span>
            </div>

            <div className="border-t border-dashed border-white/10 pt-4 space-y-3">
              {[
                { icon: '🏠', label: 'Club',    val: booking.club?.name },
                { icon: '📅', label: 'Date',    val: new Date(booking.visitDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }) },
                { icon: '⏰', label: 'Time',    val: booking.visitTime },
                { icon: '👥', label: 'Guests',  val: `${booking.numberOfPeople} (${booking.guestType})` },
                { icon: '💰', label: 'Advance', val: `₹${parseFloat(booking.advanceAmount || 0).toLocaleString('en-IN')} paid` },
                { icon: '🟢', label: 'Status',  val: 'Confirmed' },
              ].map(({ icon, label, val }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-white/50">{icon} {label}</span>
                  <span className="font-medium">{val || '—'}</span>
                </div>
              ))}

              {booking.transport && (
                <div className="border-t border-white/10 pt-3 mt-3">
                  <p className="text-xs text-white/40 mb-2">🚗 TRANSPORT</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Type</span>
                    <span className="text-gold-400 font-bold uppercase">{booking.transportType}</span>
                  </div>
                  {booking.pickupLocation && (
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-white/50">Pickup</span>
                      <span className="text-right max-w-[60%]">{booking.pickupLocation}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* WhatsApp notice */}
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6 text-sm text-green-400">
            📱 Booking details & ticket sent to your WhatsApp number
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/my-bookings" className="btn-outline flex-1 py-3 text-center">View All Bookings</Link>
            <Link to="/clubs" className="btn-neon flex-1 py-3 text-center">Book Another →</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
