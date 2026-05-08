module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const isAdmin = email === 'admin@nightvibe.com' && password === 'Admin@123456';
  const isOwner = email === 'owner@nightvibe.com' && password === 'Owner@123456';
  const isValidDemo = isAdmin || isOwner || (password.length >= 8);

  if (!isValidDemo) return res.status(401).json({ error: 'Invalid email or password' });

  const role = isAdmin ? 'super_admin' : isOwner ? 'club_owner' : 'customer';
  const name = isAdmin ? 'Super Admin' : isOwner ? 'Club Owner' : email.split('@')[0].replace(/[^a-zA-Z\s]/g, ' ');

  const user = {
    id: `user-${Date.now()}`, name, email,
    phone: '9876543210', role,
    isActive: true, isVerified: true,
    whatsappEnabled: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastLogin: new Date().toISOString(),
  };

  const token = Buffer.from(JSON.stringify({
    userId: user.id, role: user.role, email: user.email,
    name: user.name, phone: user.phone,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000
  })).toString('base64');

  return res.status(200).json({ token, user });
};
