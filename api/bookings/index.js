function genId() {
  return 'NV-' + Date.now().toString(36).toUpperCase().slice(-4) + '-' + Math.random().toString(36).substr(2,4).toUpperCase();
}

const CLUBS_PRICES = {
  'club-001': { 'pkg-001-a':800, 'pkg-001-b':1500, 'pkg-001-c':1800, 'pkg-001-d':2500, name:'Zodiac The Club', city:'Gurugram' },
  'club-002': { 'pkg-002-a':1200, 'pkg-002-b':2200, 'pkg-002-c':1600, 'pkg-002-d':3500, name:'Privee — The Social', city:'New Delhi' },
  'club-003': { 'pkg-003-a':1000, 'pkg-003-b':1800, 'pkg-003-c':2000, 'pkg-003-d':3000, name:'F Bar & Lounge', city:'Mumbai' },
  'club-004': { 'pkg-004-a':600, 'pkg-004-b':1200, 'pkg-004-c':900, 'pkg-004-d':2000, name:"Tito's Club", city:'Goa' },
  'club-005': { 'pkg-005-a':700, 'pkg-005-b':1400, 'pkg-005-c':1700, 'pkg-005-d':2800, name:'The Humming Tree', city:'Bangalore' },
  'club-006': { 'pkg-006-a':1500, 'pkg-006-b':3000, 'pkg-006-c':2500, 'pkg-006-d':5000, name:'Aer Lounge Bar', city:'Mumbai' },
};

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { clubId, packageId, visitDate, visitTime, numberOfPeople, guestType, transportType, pickupLocation, pickupTime, specialRequests, tableRequired } = req.body || {};
    if (!clubId || !visitDate || !visitTime || !numberOfPeople)
      return res.status(400).json({ error: 'Missing required fields: clubId, visitDate, visitTime, numberOfPeople' });

    const clubData = CLUBS_PRICES[clubId] || { name: 'Club', city: 'City' };
    const basePrice = packageId && clubData[packageId] ? clubData[packageId] : 500;
    const people = parseInt(numberOfPeople) || 1;
    let totalAmount = guestType === 'couple' ? basePrice * 1.7 : guestType === 'group' ? basePrice * people * 0.88 : basePrice * people;
    if (tableRequired) totalAmount += 500;
    totalAmount = Math.round(totalAmount);
    const advanceAmount = Math.round(totalAmount * 0.15);

    const booking = {
      id: 'b-' + Date.now(),
      bookingId: genId(),
      userId: 'demo-user',
      clubId, packageId: packageId || null,
      visitDate, visitTime,
      numberOfPeople: people,
      guestType: guestType || 'single',
      tableRequired: tableRequired || false,
      transportRequired: transportType && transportType !== 'none',
      transportType: transportType || 'none',
      pickupLocation: pickupLocation || null,
      pickupTime: pickupTime || null,
      status: 'pending',
      totalAmount, advanceAmount,
      specialRequests: specialRequests || null,
      createdAt: new Date().toISOString(),
      club: { name: clubData.name, city: clubData.city, images: ['https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=300'] },
      package: packageId ? { name: 'Selected Package', type: 'entry_only' } : null,
      transport: transportType && transportType !== 'none' ? { type: transportType, pickupLocation, pickupTime, status: 'scheduled' } : null,
      payment: { status: 'pending', amount: advanceAmount },
    };
    return res.status(201).json({ booking, message: 'Booking created successfully!' });
  }

  return res.status(200).json({ bookings: [], pagination: { total:0, page:1, pages:1 } });
};
