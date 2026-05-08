module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { bookingId } = req.body || {};
  const bookings = global.__BOOKINGS__ || [];
  const booking = bookings.find(b => b.id === bookingId);

  const amount = booking ? booking.advanceAmount : 500;
  const orderId = 'order_demo_' + Date.now();

  return res.status(200).json({
    orderId,
    amount: Math.round(amount * 100),
    currency: 'INR',
    bookingId: booking?.bookingId || 'DEMO',
    key: 'rzp_test_demo_key',
    isDemoMode: true,
  });
};
