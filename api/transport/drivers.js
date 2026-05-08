const DEMO_DRIVERS = [
  { id:'d1', name:'Rajesh Kumar', phone:'9988776655', vehicleType:'cab', vehicleNumber:'HR26 AB 1234', vehicleModel:'Swift Dzire', isAvailable:true, isActive:true, rating:4.8, totalTrips:342 },
  { id:'d2', name:'Suresh Singh', phone:'9977665544', vehicleType:'cab', vehicleNumber:'DL3C AB 5678', vehicleModel:'Honda City', isAvailable:true, isActive:true, rating:4.9, totalTrips:521 },
  { id:'d3', name:'Amit Sharma', phone:'9966554433', vehicleType:'bike', vehicleNumber:'MH12 AB 9012', vehicleModel:'Royal Enfield', isAvailable:false, isActive:true, rating:4.7, totalTrips:189 },
];
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'POST') {
    const d = req.body || {};
    return res.status(201).json({ driver: { id:'d-'+Date.now(), ...d, isAvailable:true, isActive:true, rating:5.0, totalTrips:0 } });
  }
  return res.status(200).json({ drivers: DEMO_DRIVERS });
};
