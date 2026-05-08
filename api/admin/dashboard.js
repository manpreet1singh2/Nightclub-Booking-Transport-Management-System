module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const bookings = global.__BOOKINGS__ || [];
  const today = new Date().toISOString().split('T')[0];

  return res.status(200).json({
    stats: {
      totalBookings: bookings.length + 248,
      todayBookings: bookings.filter(b => b.createdAt?.startsWith(today)).length + 12,
      monthBookings: bookings.length + 87,
      totalRevenue: bookings.reduce((s,b) => s + (b.advanceAmount||0), 0) + 284500,
      monthRevenue: bookings.reduce((s,b) => s + (b.advanceAmount||0), 0) + 48200,
      pendingTransports: bookings.filter(b => b.transportRequired && b.status === 'pending').length + 5,
      totalUsers: 1024,
      activeClubs: 6,
    },
    statusBreakdown: [
      { status: 'confirmed', count: bookings.filter(b=>b.status==='confirmed').length + 142 },
      { status: 'pending',   count: bookings.filter(b=>b.status==='pending').length + 38 },
      { status: 'completed', count: 62 },
      { status: 'cancelled', count: 6 },
    ],
    recentBookings: [...bookings.slice(0,5), {
      id: 'demo-recent-1', bookingId: 'NV-RECENT-001', status: 'confirmed',
      visitDate: today, visitTime: '22:00', totalAmount: 4500, numberOfPeople: 2, guestType: 'couple',
      user: { name: 'Arjun Sharma', phone: '9876543210' },
      club: { name: 'Zodiac The Club', city: 'Gurugram' },
    }, {
      id: 'demo-recent-2', bookingId: 'NV-RECENT-002', status: 'pending',
      visitDate: today, visitTime: '21:30', totalAmount: 6000, numberOfPeople: 3, guestType: 'group',
      user: { name: 'Priya Mehta', phone: '9811223344' },
      club: { name: 'Privee — The Social', city: 'New Delhi' },
    }],
  });
};
