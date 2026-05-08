const { CLUBS } = require('../_data');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { search, city, page = 1, limit = 12 } = req.query;
  let clubs = [...CLUBS];

  if (search) clubs = clubs.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  if (city && city !== 'All') clubs = clubs.filter(c => c.city.toLowerCase() === city.toLowerCase());

  const total = clubs.length;
  const start = (parseInt(page) - 1) * parseInt(limit);
  clubs = clubs.slice(start, start + parseInt(limit));

  return res.status(200).json({
    clubs,
    pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)), limit: parseInt(limit) }
  });
};
