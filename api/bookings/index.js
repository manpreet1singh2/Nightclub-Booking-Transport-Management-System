const { CLUBS } = require('../_data');

// In-memory store (resets per cold start — demo only)
const BOOKINGS = global.__BOOKINGS__ || [];
global.__BOOKINGS__ = BOOKINGS;

function genId() {
  return 'NV-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2,4).toUpperCase();
}

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { clubId, packageId, visitDate, visitTime, numberOfPeople, guestType, tableRequired, transportType, pickupLocation, pickupTime, specialRequests, promoCode } = req.body || {};

    if (!clubId || !visitDate || !visitTime || !numberOfPeople) {
      return res.status(400).json({ error: 'Missing required booking fields' });
    }

    const club = CLUBS.find(c => c.id === clubId);
    if (!club) return res.status(404).json({ error: 'Club not found' });

    const pkg = club.packages.find(p => p.id === packageId);

    let totalAmount = 0;
    if (pkg) {
      if (guestType === 'couple' && pkg.priceCouple) totalAmount = pkg.priceCouple;
      else if (guestType === 'group' && pkg.priceGroup) totalAmount = pkg.priceGroup * numberOfPeople;
      else totalAmount = pkg.pricePerPerson * numberOfPeople;
    } else {
      totalAmount = 500 * numberOfPeople;
    }

    const advanceAmount = parseFloat((totalAmount * 0.15).toFixed(2));
    const booking = {
      id: `b-${Date.now()}`,
      bookingId: genId(),
      userId: `demo-user`,
      clubId,
      packageId: packageId || null,
      visitDate,
      visitTime,
      numberOfPeople: parseInt(numberOfPeople),
      guestType: guestType || 'single',
      tableRequired: tableRequired || false,
      transportRequired: transportType && transportType !== 'none',
      transportType: transportType || 'none',
      pickupLocation: pickupLocation || null,
      pickupTime: pickupTime || null,
      status: 'pending',
      totalAmount,
      advanceAmount,
      specialRequests: specialRequests || null,
      promoCode: promoCode || null,
      discountAmount: 0,
      createdAt: new Date().toISOString(),
      club: { name: club.name, address: club.address, city: club.city, phone: club.phone, images: club.images },
      package: pkg ? { name: pkg.name, type: pkg.type } : null,
      transport: transportType !== 'none' ? { type: transportType, pickupLocation, pickupTime, status: 'scheduled' } : null,
      payment: { status: 'pending', amount: advanceAmount },
    };

    BOOKINGS.unshift(booking);
    return res.status(201).json({ booking, message: 'Booking created successfully!' });
  }

  if (req.method === 'GET') {
    const { status, page = 1, limit = 15 } = req.query;
    let list = [...BOOKINGS];
    if (status && status !== 'all') list = list.filter(b => b.status === status);
    const total = list.length;
    list = list.slice((parseInt(page)-1)*parseInt(limit), parseInt(page)*parseInt(limit));
    return res.status(200).json({
      bookings: list,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total/parseInt(limit)) }
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
