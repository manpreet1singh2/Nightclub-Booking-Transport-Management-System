import toast from 'react-hot-toast';
import { useBookingStore } from '../../store/bookingStore';

const GUEST_TYPES = [
  { value: 'single', label: 'Single', icon: '👤', desc: "Just me" },
  { value: 'couple', label: 'Couple', icon: '👫', desc: 'Me + 1' },
  { value: 'group',  label: 'Group',  icon: '👥', desc: '3 or more' },
];
const PKG_ICONS = { entry_only:'🎟️', entry_drinks:'🍹', entry_cab:'🚗', entry_bike:'🏍️', full_combo:'⭐' };

export default function StepPackage({ club, onNext }) {
  const { selectedPackage, setSelectedPackage, bookingData, updateBookingData, getTotal, getAdvance } = useBookingStore();

  const handleNext = () => {
    if (!selectedPackage) { toast.error('Please select a package'); return; }
    onNext();
  };

  return (
    <div className="space-y-8">
      <div className="glass-card p-6">
        <h2 className="font-bold text-lg mb-5">👥 Who's Coming?</h2>
        <div className="grid grid-cols-3 gap-4">
          {GUEST_TYPES.map(({ value, label, icon, desc }) => (
            <button key={value} onClick={() => updateBookingData({ guestType: value })}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                bookingData.guestType === value
                  ? 'border-neon-purple bg-neon-purple/20 text-neon-purple'
                  : 'border-white/10 hover:border-white/30 text-white/60'}`}>
              <div className="text-3xl mb-1">{icon}</div>
              <div className="font-bold text-sm">{label}</div>
              <div className="text-xs opacity-60">{desc}</div>
            </button>
          ))}
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-white/70 mb-3">Number of Guests</label>
          <div className="flex items-center gap-4">
            <button onClick={() => updateBookingData({ numberOfPeople: Math.max(1, bookingData.numberOfPeople - 1) })}
              className="w-10 h-10 glass-card flex items-center justify-center text-xl font-bold hover:bg-white/10 transition-colors">−</button>
            <span className="text-3xl font-black w-12 text-center">{bookingData.numberOfPeople}</span>
            <button onClick={() => updateBookingData({ numberOfPeople: Math.min(100, bookingData.numberOfPeople + 1) })}
              className="w-10 h-10 glass-card flex items-center justify-center text-xl font-bold hover:bg-white/10 transition-colors">+</button>
            <span className="text-white/40 text-sm ml-2">people</span>
          </div>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <button onClick={() => updateBookingData({ tableRequired: !bookingData.tableRequired })}
            className={`w-12 h-6 rounded-full transition-all relative ${bookingData.tableRequired ? 'bg-neon-purple' : 'bg-white/10'}`}>
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${bookingData.tableRequired ? 'left-6' : 'left-0.5'}`} />
          </button>
          <span className="text-sm text-white/60">🪑 Reserve a table (+₹500)</span>
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="font-bold text-lg mb-5">🎟️ Select Package</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(club?.packages || []).map((pkg) => (
            <button key={pkg.id} onClick={() => setSelectedPackage(pkg)}
              className={`text-left p-5 rounded-xl border-2 transition-all ${
                selectedPackage?.id === pkg.id
                  ? 'border-neon-purple bg-neon-purple/15 shadow-neon-purple'
                  : pkg.type === 'full_combo'
                  ? 'border-gold-500/40 hover:border-gold-500/70'
                  : 'border-white/10 hover:border-white/30'}`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-xl mr-2">{PKG_ICONS[pkg.type]}</span>
                  <span className="font-bold">{pkg.name}</span>
                  {pkg.type === 'full_combo' && (
                    <span className="ml-2 text-xs bg-gold-500/20 text-gold-400 px-2 py-0.5 rounded-full">Best Value</span>
                  )}
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                  selectedPackage?.id === pkg.id ? 'border-neon-purple bg-neon-purple' : 'border-white/20'}`}>
                  {selectedPackage?.id === pkg.id && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
              </div>
              <div className="space-y-1">
                {(pkg.features || []).slice(0, 3).map((f) => (
                  <div key={f} className="text-xs text-white/50 flex items-center gap-1.5">
                    <span className="text-neon-purple">✓</span> {f}
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-white/10 flex items-baseline gap-2">
                <span className="text-lg font-black text-gold-400">₹{pkg.pricePerPerson}</span>
                <span className="text-xs text-white/40">/person</span>
                {pkg.priceCouple && <span className="text-xs text-white/30">· Couple ₹{pkg.priceCouple}</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedPackage && (
        <div className="glass-card p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-white/50">Selected: <span className="text-white font-medium">{selectedPackage.name}</span></p>
            <p className="text-xl font-black text-gold-400 mt-1">
              Total: ₹{getTotal().toLocaleString('en-IN')}
              <span className="text-sm font-normal text-white/40 ml-2">(Advance: ₹{getAdvance().toLocaleString('en-IN')})</span>
            </p>
          </div>
          <button onClick={handleNext} className="btn-neon px-6 py-3">Next: Date & Time →</button>
        </div>
      )}
      {!selectedPackage && (
        <div className="flex justify-end">
          <button onClick={handleNext} className="btn-neon px-6 py-3">Next →</button>
        </div>
      )}
    </div>
  );
}
