if (!global.__BOOKINGS__) global.__BOOKINGS__ = [];

function genId() {
  const ts = Date.now().toString(36).toUpperCase().slice(-4);
  const rand = Math.random().toString(36).substr(2,4).toUpperCase();
  return `NV-${ts}-${rand}`;
}

const CLUBS_PRICES = {
  'club-001': { 'pkg-001-a':800,  'pkg-001-b':1500, 'pkg-001-c':1800, 'pkg-001-d':2500, name:'Zodiac The Club',      city:'Gurugram',   img:'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=300' },
  'club-002': { 'pkg-002-a':1200, 'pkg-002-b':2200, 'pkg-002-c':1600, 'pkg-002-d':3500, name:'Privee — The Social',  city:'New Delhi',  img:'https://images.unsplash.com/photo-1571204829887-3b8d69e4094d?w=300' },
  'club-003': { 'pkg-003-a':1000, 'pkg-003-b':1800, 'pkg-003-c':2000, 'pkg-003-d':3000, name:'F Bar & Lounge',       city:'Mumbai',     img:'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=300' },
  'club-004': { 'pkg-004-a':600,  'pkg-004-b':1200, 'pkg-004-c':900,  'pkg-004-d':2000, name:"Tito's Club",          city:'Goa',        img:'https://images.unsplash.com/photo-1578736641330-3155e606cd40?w=300' },
  'club-005': { 'pkg-005-a':700,  'pkg-005-b':1400, 'pkg-005-c':1700, 'pkg-005-d':2800, name:'The Humming Tree',     city:'Bangalore',  img:'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=300' },
  'club-006': { 'pkg-006-a':1500, 'pkg-006-b':3000, 'pkg-006-c':2500, 'pkg-006-d':5000, name:'Aer Lounge Bar',       city:'Mumbai',     img:'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300' },
};

const PKG_NAMES = {
  'pkg-001-a':'Entry Only','pkg-001-b':'Entry + Drinks','pkg-001-c':'Entry + Cab','pkg-001-d':'⭐ Full Combo',
  'pkg-002-a':'Entry Only','pkg-002-b':'Entry + Drinks','pkg-002-c':'Entry + Cab','pkg-002-d':'⭐ Full Combo',
  'pkg-003-a':'Entry Only','pkg-003-b':'Entry + Drinks','pkg-003-c':'Entry + Cab','pkg-003-d':'⭐ Full Combo',
  'pkg-004-a':'Entry Only','pkg-004-b':'Entry + Drinks','pkg-004-c':'Entry + Cab','pkg-004-d':'⭐ Full Combo',
  'pkg-005-a':'Entry Only','pkg-005-b':'Entry + Drinks','pkg-005-c':'Entry + Cab','pkg-005-d':'⭐ Full Combo',
  'pkg-006-a':'Entry Only','pkg-006-b':'Entry + Drinks','pkg-006-c':'Entry + Cab','pkg-006-d':'⭐ Full Combo',
};

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { clubId, packageId, visitDate, visitTime, numberOfPeople, guestType, transportType,
            pickupLocation, pickupTime, specialRequests, tableRequired, userName } = req.body || {};

    if (!clubId || !visitDate || !visitTime || !numberOfPeople)
      return res.status(400).json({ error: 'Missing required fields' });

    const clubData = CLUBS_PRICES[clubId] || {};
    const basePrice = (packageId && clubData[packageId]) ? clubData[packageId] : 800;
    const people = parseInt(numberOfPeople) || 1;
    let totalAmount = guestType === 'couple'
      ? Math.round(basePrice * 1.7)
      : guestType === 'group'
        ? Math.round(basePrice * people * 0.88)
        : basePrice * people;
    if (tableRequired) totalAmount += 500;
    const advanceAmount = Math.round(totalAmount * 0.15);

    const booking = {
      id: 'b-' + Date.now(),
      bookingId: genId(),
      userId: 'demo-user',
      clubId, packageId: packageId || null,
      visitDate, visitTime,
      numberOfPeople: people,
      guestType: guestType || 'single',
      tableRequired: !!tableRequired,
      transportRequired: !!(transportType && transportType !== 'none'),
      transportType: transportType || 'none',
      pickupLocation: pickupLocation || null,
      pickupTime: pickupTime || null,
      specialRequests: specialRequests || null,
      status: 'confirmed',
      totalAmount, advanceAmount,
      createdAt: new Date().toISOString(),
      club: { name: clubData.name || 'Club', city: clubData.city || 'City', images: [clubData.img || ''] },
      package: packageId ? { name: PKG_NAMES[packageId] || 'Package', features: ['Club Entry','Dance Floor'] } : null,
      transport: (transportType && transportType !== 'none') ? { type: transportType, status: 'scheduled', pickupLocation, pickupTime } : null,
      payment: { status: 'pending', amount: advanceAmount },
      user: { name: userName || 'Guest', phone: '9999999999' },
    };

    global.__BOOKINGS__.push(booking);
    return res.status(201).json({ booking });
  }

  // GET - return all bookings (admin)
  const { page = 1, limit = 20, status } = req.query;
  let bookings = [...(global.__BOOKINGS__ || [])];
  if (status && status !== 'all') bookings = bookings.filter(b => b.status === status);
  const total = bookings.length;
  const start = (parseInt(page) - 1) * parseInt(limit);
  bookings = bookings.slice(start, start + parseInt(limit)).reverse();
  return res.status(200).json({ bookings, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } });
};
