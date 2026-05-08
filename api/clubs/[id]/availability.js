const { CLUBS } = require('../../_data');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  const club = CLUBS.find(c => c.id === id);
  if (!club) return res.status(404).json({ error: 'Club not found' });

  // Demo: always available with random spots
  const totalBooked = Math.floor(Math.random() * (club.capacity * 0.6));
  const spotsLeft = club.capacity - totalBooked;

  return res.status(200).json({
    available: spotsLeft > 10,
    spotsLeft,
    totalBooked,
    capacity: club.capacity
  });
};
