const DEMO_TRANSPORTS = [
  { id:'t1', type:'cab', pickupLocation:'Connaught Place, New Delhi', pickupTime:'21:30', status:'driver_assigned', driverNotified:true, booking:{ bookingId:'NV-DEMO001', user:{ name:'Arjun Sharma', phone:'9876543210' } }, driver:{ name:'Rajesh Kumar', phone:'9988776655', vehicleNumber:'HR26 AB 1234', vehicleModel:'Swift Dzire', rating:4.8 } },
  { id:'t2', type:'bike', pickupLocation:'Koramangala, Bangalore', pickupTime:'20:00', status:'scheduled', driverNotified:false, booking:{ bookingId:'NV-DEMO003', user:{ name:'Priya Mehta', phone:'9811223344' } }, driver:null },
];
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  return res.status(200).json({ transports: DEMO_TRANSPORTS });
};
