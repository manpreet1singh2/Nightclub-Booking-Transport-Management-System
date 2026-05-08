module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, phone, password } = req.body || {};
  if (!name || !email || !phone || !password)
    return res.status(400).json({ error: 'All fields required' });
  if (password.length < 8)
    return res.status(400).json({ error: 'Password must be at least 8 characters' });

  const userId = crypto.randomUUID ? crypto.randomUUID() : `u-${Date.now()}-${Math.random().toString(36).substr(2,9)}`;
  const user = {
    id: userId, name, email, phone,
    role: 'customer', isActive: true, isVerified: false,
    whatsappEnabled: true,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };

  const token = Buffer.from(JSON.stringify({
    userId: user.id, role: user.role, email: user.email,
    name: user.name, phone: user.phone,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000
  })).toString('base64');

  return res.status(201).json({ token, user });
};
