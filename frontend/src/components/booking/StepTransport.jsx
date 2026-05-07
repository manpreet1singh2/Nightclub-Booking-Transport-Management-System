import { useBookingStore } from '../../store/bookingStore';

const TRANSPORT_OPTIONS = [
  { value: 'none', icon: '🚶', label: 'No Transport', desc: 'I\'ll arrange my own ride', price: 'Free' },
  { value: 'cab',  icon: '🚗', label: 'Cab Pickup',   desc: 'AC car pickup from your location', price: '+ ₹300' },
  { value: 'bike', icon: '🏍️', label: 'Bike Pickup',  desc: 'Quick bike pickup from your location', price: '+ ₹150' },
];

const PICKUP_TIMES = ['19:00','19:30','20:00','20:30','21:00','21:30','22:00','22:30','23:00','23:30'];

export default function StepTransport({ onNext, onBack }) {
  const { bookingData, updateBookingData, selectedPackage } = useBookingStore();

  const pkgIncludesTransport = selectedPackage?.includesTransport;

  return (
    <div className="space-y-6">
      {pkgIncludesTransport && (
        <div className="glass-card p-4 border border-green-500/30 bg-green-500/5">
          <p className="text-green-400 font-medium text-sm">✅ Your package includes complimentary transport!</p>
        </div>
      )}

      {/* Transport type */}
      <div className="glass-card p-6">
        <h2 className="font-bold text-lg mb-5">🚗 Transport Preference</h2>
        <div className="space-y-3">
          {TRANSPORT_OPTIONS.map(({ value, icon, label, desc, price }) => (
            <button key={value}
              onClick={() => updateBookingData({ transportType: value })}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                bookingData.transportType === value
                  ? 'border-neon-purple bg-neon-purple/15'
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              <div className="text-3xl w-12 text-center flex-shrink-0">{icon}</div>
              <div className="flex-1">
                <div className="font-bold text-sm">{label}</div>
                <div className="text-xs text-white/50 mt-0.5">{desc}</div>
              </div>
              <div className={`text-sm font-bold ${value === 'none' ? 'text-white/40' : 'text-gold-400'}`}>{price}</div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                bookingData.transportType === value ? 'border-neon-purple bg-neon-purple' : 'border-white/20'
              }`}>
                {bookingData.transportType === value && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Pickup details */}
      {bookingData.transportType !== 'none' && (
        <div className="glass-card p-6 space-y-5">
          <h2 className="font-bold text-lg">📍 Pickup Details</h2>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Pickup Address *</label>
            <input
              type="text"
              placeholder="Enter your full pickup address"
              value={bookingData.pickupLocation}
              onChange={(e) => updateBookingData({ pickupLocation: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-3">Pickup Time *</label>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {PICKUP_TIMES.map((t) => (
                <button key={t}
                  onClick={() => updateBookingData({ pickupTime: t })}
                  className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                    bookingData.pickupTime === t
                      ? 'border-neon-purple bg-neon-purple/20 text-neon-purple'
                      : 'border-white/10 text-white/50 hover:border-white/30'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card-dark p-4 rounded-xl text-sm text-white/60">
            <p>🔔 <strong className="text-white">Reminder:</strong> You'll receive a WhatsApp alert 30 mins before pickup.</p>
            <p className="mt-1">📱 Driver details will be sent once assigned.</p>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <button onClick={onBack} className="btn-outline px-6 py-3">← Back</button>
        <button onClick={onNext} className="btn-neon flex-1 py-3">Next: Payment →</button>
      </div>
    </div>
  );
}
