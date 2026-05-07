import { useBookingStore } from '../../store/bookingStore';
import toast from 'react-hot-toast';

const TIME_SLOTS = ['20:00','20:30','21:00','21:30','22:00','22:30','23:00','23:30','00:00','00:30','01:00'];

export default function StepDateTime({ onNext, onBack }) {
  const { bookingData, updateBookingData } = useBookingStore();

  const today = new Date().toISOString().split('T')[0];

  const handleNext = () => {
    if (!bookingData.visitDate) { toast.error('Please select a date'); return; }
    if (!bookingData.visitTime) { toast.error('Please select a time slot'); return; }
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Date */}
      <div className="glass-card p-6">
        <h2 className="font-bold text-lg mb-5">📅 Select Visit Date</h2>
        <input
          type="date"
          min={today}
          value={bookingData.visitDate}
          onChange={(e) => updateBookingData({ visitDate: e.target.value })}
          className="input-field max-w-xs"
          style={{ colorScheme: 'dark' }}
        />
        {bookingData.visitDate && (
          <p className="mt-3 text-sm text-neon-purple font-medium">
            📅 {new Date(bookingData.visitDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        )}
      </div>

      {/* Time */}
      <div className="glass-card p-6">
        <h2 className="font-bold text-lg mb-5">⏰ Select Arrival Time</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {TIME_SLOTS.map((t) => (
            <button key={t}
              onClick={() => updateBookingData({ visitTime: t })}
              className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                bookingData.visitTime === t
                  ? 'border-neon-purple bg-neon-purple/20 text-neon-purple'
                  : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Special requests */}
      <div className="glass-card p-6">
        <h2 className="font-bold text-sm mb-3 text-white/70">💬 Special Requests <span className="font-normal text-white/30">(optional)</span></h2>
        <textarea
          rows={3}
          placeholder="Birthday celebration, dietary requirements, accessibility needs..."
          value={bookingData.specialRequests}
          onChange={(e) => updateBookingData({ specialRequests: e.target.value })}
          className="input-field resize-none"
        />
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <button onClick={onBack} className="btn-outline px-6 py-3">← Back</button>
        <button onClick={handleNext} className="btn-neon flex-1 py-3">Next: Transport →</button>
      </div>
    </div>
  );
}
