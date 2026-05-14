module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { bookingId, razorpay_payment_id, razorpay_order_id } = req.body || {};

  // In demo mode - always succeed
  if (global.__BOOKINGS__) {
    const booking = global.__BOOKINGS__.find(b => b.id === bookingId || b.bookingId === bookingId);
    if (booking) {
      booking.status = 'confirmed';
      booking.payment = { status: 'captured', amount: booking.advanceAmount, method: 'demo', paidAt: new Date().toISOString() };
    }
  }

  return res.status(200).json({
    success: true,
    message: 'Payment verified successfully (demo mode)',
    paymentId: razorpay_payment_id || 'pay_demo_' + Date.now(),
    orderId: razorpay_order_id,
    isDemoMode: true,
  });
};
