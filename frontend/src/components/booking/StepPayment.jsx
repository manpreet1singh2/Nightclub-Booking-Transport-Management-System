import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useBookingStore } from '../../store/bookingStore';
import { useAuthStore } from '../../store/authStore';

export default function StepPayment({ club, onBack }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const { selectedPackage, bookingData, createBooking, getTotal, getAdvance } = useBookingStore();

  const total   = getTotal();
  const advance = getAdvance();

  const handlePay = async () => {
    setLoading(true);
    try {
      // 1. Create booking
      const result = await createBooking();
      if (!result.success) { toast.error(result.error || 'Booking failed'); setLoading(false); return; }
      const booking = result.booking;

      // 2. Create order
      const { data: orderData } = await api.post('/payments/create-order', { bookingId: booking.id });

      // 3. Demo mode — skip Razorpay, auto-confirm
      if (orderData.isDemoMode || !window.Razorpay) {
        await api.post('/payments/verify', {
          razorpay_order_id:   orderData.orderId,
          razorpay_payment_id: 'pay_demo_' + Date.now(),
          razorpay_signature:  'demo_sig',
          bookingId: booking.id,
        });
        toast.success('🎉 Booking confirmed!');
        navigate('/booking/success', { state: { booking } });
        return;
      }

      // 4. Real Razorpay checkout
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: 'INR',
        name: 'NightVibe',
        description: `Booking ${booking.bookingId}`,
        order_id: orderData.orderId,
        prefill: { name: user?.name, email: user?.email, contact: `+91${user?.phone}` },
        theme: { color: '#a855f7' },
        handler: async (response) => {
          try {
            await api.post('/payments/verify', {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              bookingId: booking.id,
            });
            toast.success('Payment successful! 🎉');
            navigate('/booking/success', { state: { booking } });
          } catch { toast.error('Payment verification failed'); }
        },
        modal: { ondismiss: () => { setLoading(false); toast('Payment cancelled'); } },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h2 className="font-bold text-lg mb-5">📋 Order Summary</h2>
        <div className="space-y-3">
          <Row label="Club"      value={club?.name} />
          <Row label="Package"   value={selectedPackage?.name || 'Basic Entry'} />
          <Row label="Date"      value={bookingData.visitDate ? new Date(bookingData.visitDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short', year:'numeric' }) : '—'} />
          <Row label="Time"      value={bookingData.visitTime} />
          <Row label="Guests"    value={`${bookingData.numberOfPeople} (${bookingData.guestType})`} />
          <Row label="Transport" value={bookingData.transportType === 'none' ? 'None' : bookingData.transportType?.toUpperCase()} />
          {bookingData.pickupLocation && <Row label="Pickup" value={bookingData.pickupLocation} />}
          {bookingData.tableRequired  && <Row label="Table"  value="Reserved (+₹500)" />}
          <div className="border-t border-white/10 pt-3 space-y-2">
            <Row label="Total Amount"        value={`₹${total.toLocaleString('en-IN')}`} bold />
            <Row label="Advance Now (15%)"   value={`₹${advance.toLocaleString('en-IN')}`} gold />
            <Row label="Balance at Entry"    value={`₹${(total - advance).toLocaleString('en-IN')}`} />
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="font-bold text-sm mb-4 text-white/70">👤 Booking For</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Chip icon="👤" label="Name"  value={user?.name} />
          <Chip icon="📧" label="Email" value={user?.email} />
          <Chip icon="📱" label="Phone" value={user?.phone ? `+91 ${user.phone}` : '—'} />
        </div>
      </div>

      <div className="glass-card p-5 border border-neon-purple/20 bg-neon-purple/5">
        <p className="text-sm text-white/70">
          🔒 <strong className="text-white">Secure:</strong> Only{' '}
          <strong className="text-gold-400">₹{advance.toLocaleString('en-IN')}</strong> (15%) charged now.
          Balance ₹{(total - advance).toLocaleString('en-IN')} paid at venue.
          WhatsApp confirmation sent instantly.
        </p>
      </div>

      <div className="flex gap-4">
        <button onClick={onBack} disabled={loading} className="btn-outline px-6 py-3 disabled:opacity-50">← Back</button>
        <button onClick={handlePay} disabled={loading} className="btn-gold flex-1 py-4 text-base font-bold disabled:opacity-50">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              Confirming...
            </span>
          ) : `💳 Confirm & Pay ₹${advance.toLocaleString('en-IN')}`}
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, bold, gold }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-white/50">{label}</span>
      <span className={`font-medium ${gold ? 'text-gold-400 font-bold text-base' : bold ? 'text-white font-semibold' : 'text-white/80'}`}>
        {value || '—'}
      </span>
    </div>
  );
}
function Chip({ icon, label, value }) {
  return (
    <div className="glass-card-dark rounded-xl p-3">
      <div className="text-xs text-white/40 mb-1">{icon} {label}</div>
      <div className="text-sm font-medium truncate">{value || '—'}</div>
    </div>
  );
}
