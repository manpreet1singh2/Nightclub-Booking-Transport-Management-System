if (!global.__BOOKINGS__) global.__BOOKINGS__ = [];

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const bookings = global.__BOOKINGS__ || [];
  const today = new Date().toISOString().split('T')[0];
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

  const todayB  = bookings.filter(b => b.createdAt?.startsWith(today));
  const monthB  = bookings.filter(b => b.createdAt >= monthStart);

  return res.status(200).json({
    stats: {
      totalBookings:     bookings.length + 248,
      todayBookings:     todayB.length + 12,
      monthBookings:     monthB.length + 87,
      totalRevenue:      bookings.reduce((s,b) => s + (b.advanceAmount||0), 0) + 284500,
      monthRevenue:      monthB.reduce((s,b)  => s + (b.advanceAmount||0), 0) + 48200,
      pendingTransports: bookings.filter(b => b.transportRequired && b.status==='pending').length + 5,
      totalUsers:        1024 + bookings.length,
      activeClubs:       6,
    },
    statusBreakdown: [
      { status:'confirmed', count: bookings.filter(b=>b.status==='confirmed').length + 142 },
      { status:'pending',   count: bookings.filter(b=>b.status==='pending').length + 38 },
      { status:'completed', count: 62 },
      { status:'cancelled', count: 6 },
    ],
    recentBookings: [
      ...bookings.slice(-5).reverse(),
      {
        id:'demo-recent-1', bookingId:'NV-RECENT001', status:'confirmed',
        visitDate: today, visitTime:'22:00', totalAmount:4500, numberOfPeople:2, guestType:'couple',
        user:{ name:'Arjun Sharma', phone:'9876543210' },
        club:{ name:'Zodiac The Club', city:'Gurugram' },
      },
      {
        id:'demo-recent-2', bookingId:'NV-RECENT002', status:'confirmed',
        visitDate: today, visitTime:'21:00', totalAmount:3000, numberOfPeople:1, guestType:'single',
        user:{ name:'Priya Mehta', phone:'9811223344' },
        club:{ name:'Privee — The Social', city:'New Delhi' },
      },
    ],
  });
};
