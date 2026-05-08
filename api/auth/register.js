const { v4: uuid } = require('uuid');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, phone, password } = req.body || {};
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: 'All fields required: name, email, phone, password' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  const user = {
    id: uuid(),
    name,
    email,
    phone,
    role: 'customer',
    isActive: true,
    isVerified: false,
    whatsappEnabled: true,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };

  // Demo JWT-style token (base64 encoded payload)
  const token = Buffer.from(JSON.stringify({ userId: user.id, role: user.role, email: user.email, exp: Date.now() + 7*24*60*60*1000 })).toString('base64');

  return res.status(201).json({ token, user });
};
