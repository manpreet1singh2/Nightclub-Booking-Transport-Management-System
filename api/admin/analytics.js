module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { period = '7' } = req.query;
  const days = parseInt(period);

  const dailyBookings = Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return {
      date: d.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 20) + 5,
      revenue: (Math.floor(Math.random() * 30000) + 10000).toString(),
    };
  });

  return res.status(200).json({
    dailyBookings,
    packagePopularity: [
      { count: '89', package: { name: '⭐ Full Combo', type: 'full_combo' } },
      { count: '67', package: { name: 'Entry + Drinks', type: 'entry_drinks' } },
      { count: '45', package: { name: 'Entry + Cab', type: 'entry_cab' } },
      { count: '32', package: { name: 'Entry Only', type: 'entry_only' } },
      { count: '15', package: { name: 'Entry + Bike', type: 'entry_bike' } },
    ],
    transportStats: [
      { transportType: 'none', count: '112' },
      { transportType: 'cab',  count: '89' },
      { transportType: 'bike', count: '47' },
    ],
  });
};
