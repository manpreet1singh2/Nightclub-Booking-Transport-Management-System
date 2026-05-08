module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'PUT') {
    return res.status(200).json({ user: { ...req.body, updatedAt: new Date().toISOString() } });
  }

  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });

  try {
    const token = auth.split(' ')[1];
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    return res.status(200).json({
      user: { id: decoded.userId, email: decoded.email, role: decoded.role, name: decoded.email?.split('@')[0] || 'User', phone: '9876543210', isActive: true }
    });
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
