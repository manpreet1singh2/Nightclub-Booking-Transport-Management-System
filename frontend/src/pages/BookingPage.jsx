import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useBookingStore } from '../store/bookingStore';
import StepPackage   from '../components/booking/StepPackage';
import StepDateTime  from '../components/booking/StepDateTime';
import StepTransport from '../components/booking/StepTransport';
import StepPayment   from '../components/booking/StepPayment';

const STEPS = [
  { id: 1, label: 'Package',   icon: '🎟️' },
  { id: 2, label: 'Date/Time', icon: '📅' },
  { id: 3, label: 'Transport', icon: '🚗' },
  { id: 4, label: 'Payment',   icon: '💳' },
];

export default function BookingPage() {
  const { clubId } = useParams();
  const navigate   = useNavigate();
  const [club, setClub]       = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    step, setStep,
    setSelectedClub,
    selectedPackage,
    bookingData,
    resetBooking,
    getTotal, getAdvance,
  } = useBookingStore();

  useEffect(() => {
    resetBooking();
    api.get(`/clubs/${clubId}`)
      .then(({ data }) => { setClub(data.club); setSelectedClub(data.club); })
      .catch(() => { toast.error('Club not found'); navigate('/clubs'); })
      .finally(() => setLoading(false));
  }, [clubId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <div className="text-center">
        <div className="text-5xl animate-pulse mb-4">🌙</div>
        <p className="text-white/50">Loading booking...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Club header */}
        <div className="glass-card p-5 mb-8 flex items-center gap-4">
          <img
            src={club?.images?.[0] || 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=200'}
            alt={club?.name}
            className="w-16 h-16 rounded-xl object-cover"
          />
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-lg truncate">{club?.name}</h1>
            <p className="text-white/50 text-sm">📍 {club?.city}</p>
          </div>
          {selectedPackage && (
            <div className="text-right hidden sm:block">
              <div className="text-xs text-white/40">Total</div>
              <div className="text-xl font-black text-gold-400">₹{getTotal().toLocaleString('en-IN')}</div>
              <div className="text-xs text-white/40">Advance: ₹{getAdvance().toLocaleString('en-IN')}</div>
            </div>
          )}
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-10 px-2">
          {STEPS.map(({ id, label, icon }, i) => (
            <div key={id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-shrink-0">
                <button
                  onClick={() => id < step && setStep(id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold border-2 transition-all ${
                    id < step  ? 'bg-green-500/20 border-green-500 text-green-400 cursor-pointer' :
                    id === step ? 'bg-gradient-to-r from-neon-purple to-neon-pink border-transparent text-white shadow-neon-purple' :
                    'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
                  }`}
                >
                  {id < step ? '✓' : icon}
                </button>
                <span className={`text-xs mt-1.5 font-medium ${id === step ? 'text-neon-purple' : 'text-white/40'}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mt-[-14px] transition-all ${id < step ? 'bg-green-500/50' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {step === 1 && <StepPackage club={club} onNext={() => setStep(2)} />}
            {step === 2 && <StepDateTime onNext={() => setStep(3)} onBack={() => setStep(1)} />}
            {step === 3 && <StepTransport onNext={() => setStep(4)} onBack={() => setStep(2)} />}
            {step === 4 && <StepPayment club={club} onBack={() => setStep(3)} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
