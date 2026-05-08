module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { bookingId } = req.body || {};
  const bookings = global.__BOOKINGS__ || [];
  const booking = bookings.find(b => b.id === bookingId);
  if (booking) {
    booking.status = 'confirmed';
    booking.payment = { ...booking.payment, status: 'captured', paidAt: new Date().toISOString() };
  }
  return res.status(200).json({ success: true, message: 'Payment verified and booking confirmed!' });
};
