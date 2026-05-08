module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { status } = req.query;
  const today = new Date();
  const future = new Date(today.getTime() + 7*24*60*60*1000).toISOString().split('T')[0];
  const past = new Date(today.getTime() - 14*24*60*60*1000).toISOString().split('T')[0];

  const bookings = [
    { id:'demo-b-001', bookingId:'NV-DEMO001-TEST', userId:'demo-user', clubId:'club-001', packageId:'pkg-001-d', visitDate:future, visitTime:'22:00', numberOfPeople:2, guestType:'couple', tableRequired:true, transportRequired:true, transportType:'cab', pickupLocation:'Connaught Place, New Delhi', pickupTime:'21:30', status:'confirmed', totalAmount:4500, advanceAmount:675, createdAt:new Date(today.getTime()-2*24*60*60*1000).toISOString(), club:{ name:'Zodiac The Club', city:'Gurugram', images:['https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=300'] }, package:{ name:'⭐ Full Combo', type:'full_combo', features:['Club Entry','3 Premium Drinks','Cab Pickup & Drop'] }, transport:{ type:'cab', status:'driver_assigned', pickupLocation:'Connaught Place, New Delhi', pickupTime:'21:30' }, payment:{ status:'captured', amount:675, method:'upi', paidAt:new Date(today.getTime()-2*24*60*60*1000).toISOString() } },
    { id:'demo-b-002', bookingId:'NV-DEMO002-PAST', userId:'demo-user', clubId:'club-003', packageId:'pkg-003-b', visitDate:past, visitTime:'21:00', numberOfPeople:4, guestType:'group', tableRequired:false, transportRequired:false, transportType:'none', status:'completed', totalAmount:6400, advanceAmount:960, createdAt:new Date(today.getTime()-17*24*60*60*1000).toISOString(), club:{ name:'F Bar & Lounge', city:'Mumbai', images:['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=300'] }, package:{ name:'Entry + Drinks', type:'entry_drinks', features:['Club Entry','2 Craft Cocktails'] }, transport:null, payment:{ status:'captured', amount:960, method:'card' } },
  ];

  const filtered = status && status !== 'all' ? bookings.filter(b => b.status === status) : bookings;
  return res.status(200).json({ bookings: filtered, pagination: { total: filtered.length, page:1, pages:1 } });
};
