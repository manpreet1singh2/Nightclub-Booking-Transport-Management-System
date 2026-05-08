module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  return res.status(200).json({
    users: [
      { id:'u1', name:'Arjun Sharma', email:'arjun@example.com', phone:'9876543210', role:'customer', isActive:true, createdAt: new Date(Date.now()-30*86400000).toISOString() },
      { id:'u2', name:'Priya Mehta', email:'priya@example.com', phone:'9811223344', role:'customer', isActive:true, createdAt: new Date(Date.now()-15*86400000).toISOString() },
      { id:'u3', name:'Club Owner', email:'owner@nightvibe.com', phone:'9900112233', role:'club_owner', isActive:true, createdAt: new Date(Date.now()-60*86400000).toISOString() },
      { id:'u4', name:'Super Admin', email:'admin@nightvibe.com', phone:'9999999999', role:'super_admin', isActive:true, createdAt: new Date(Date.now()-90*86400000).toISOString() },
      { id:'u5', name:'Rahul Verma', email:'rahul@example.com', phone:'9833445566', role:'customer', isActive:true, createdAt: new Date(Date.now()-5*86400000).toISOString() },
    ],
    pagination: { total: 5, page: 1, pages: 1 }
  });
};
