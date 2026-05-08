const { CLUBS } = require('../../_data');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  const club = CLUBS.find(c => c.id === id);
  if (!club) return res.status(404).json({ error: 'Club not found' });
  return res.status(200).json({ packages: club.packages });
};
