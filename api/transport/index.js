const DEMO_DRIVERS = [
  { id:'d1', name:'Rajesh Kumar', phone:'9988776655', whatsapp:'9988776655', licenseNumber:'HR26AB1234', vehicleType:'cab', vehicleNumber:'HR26 AB 1234', vehicleModel:'Swift Dzire', isAvailable:true, isActive:true, rating:4.8, totalTrips:342 },
  { id:'d2', name:'Suresh Singh', phone:'9977665544', whatsapp:'9977665544', licenseNumber:'DL3CAB5678', vehicleType:'cab', vehicleNumber:'DL3C AB 5678', vehicleModel:'Honda City', isAvailable:true, isActive:true, rating:4.9, totalTrips:521 },
  { id:'d3', name:'Amit Sharma', phone:'9966554433', whatsapp:'9966554433', licenseNumber:'MH12AB9012', vehicleType:'bike', vehicleNumber:'MH12 AB 9012', vehicleModel:'Royal Enfield', isAvailable:false, isActive:true, rating:4.7, totalTrips:189 },
];

const DEMO_TRANSPORTS = [
  { id:'t1', type:'cab', pickupLocation:'Connaught Place, New Delhi', pickupTime:'21:30', status:'driver_assigned', driverNotified:true, booking: { bookingId:'NV-DEMO001', user:{ name:'Arjun Sharma', phone:'9876543210' } }, driver: DEMO_DRIVERS[0] },
  { id:'t2', type:'bike', pickupLocation:'Koramangala, Bangalore', pickupTime:'20:00', status:'scheduled', driverNotified:false, booking: { bookingId:'NV-DEMO003', user:{ name:'Priya Mehta', phone:'9811223344' } }, driver: null },
];

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.url?.includes('/drivers')) {
    if (req.method === 'POST') {
      return res.status(201).json({ driver: { id: 'd-' + Date.now(), ...req.body, isAvailable: true, isActive: true, rating: 5.0, totalTrips: 0 } });
    }
    return res.status(200).json({ drivers: DEMO_DRIVERS });
  }

  return res.status(200).json({ transports: DEMO_TRANSPORTS });
};
