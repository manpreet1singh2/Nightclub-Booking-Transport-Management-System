const { Club, Package, Booking } = require('../models');
const { Op, fn, col } = require('sequelize');

exports.getAllClubs = async (req, res, next) => {
  try {
    const { city, search, page = 1, limit = 12 } = req.query;
    const where = { isActive: true };
    if (city) where.city = { [Op.iLike]: `%${city}%` };
    if (search) where.name = { [Op.iLike]: `%${search}%` };

    const { count, rows } = await Club.findAndCountAll({
      where,
      include: [{ model: Package, as: 'packages', where: { isActive: true }, required: false, attributes: ['id', 'name', 'type', 'pricePerPerson'] }],
      order: [['rating', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    res.json({ clubs: rows, pagination: { total: count, page: parseInt(page), pages: Math.ceil(count / limit) } });
  } catch (err) { next(err); }
};

exports.getClubById = async (req, res, next) => {
  try {
    const club = await Club.findByPk(req.params.id, {
      include: [{ model: Package, as: 'packages', where: { isActive: true }, required: false }],
    });
    if (!club) return res.status(404).json({ error: 'Club not found' });
    res.json({ club });
  } catch (err) { next(err); }
};

exports.getClubPackages = async (req, res, next) => {
  try {
    const packages = await Package.findAll({
      where: { clubId: req.params.id, isActive: true },
      order: [['pricePerPerson', 'ASC']],
    });
    res.json({ packages });
  } catch (err) { next(err); }
};

exports.checkAvailability = async (req, res, next) => {
  try {
    const { date } = req.query;
    const club = await Club.findByPk(req.params.id);
    if (!club) return res.status(404).json({ error: 'Club not found' });

    const bookingsCount = await Booking.count({
      where: { clubId: req.params.id, visitDate: date, status: { [Op.in]: ['pending', 'confirmed'] } },
    });

    const totalPeople = await Booking.sum('numberOfPeople', {
      where: { clubId: req.params.id, visitDate: date, status: { [Op.in]: ['pending', 'confirmed'] } },
    });

    const available = (totalPeople || 0) < club.capacity;
    const spotsLeft = club.capacity - (totalPeople || 0);

    res.json({ available, spotsLeft, totalBooked: totalPeople || 0, capacity: club.capacity });
  } catch (err) { next(err); }
};

exports.createClub = async (req, res, next) => {
  try {
    const club = await Club.create(req.body);
    res.status(201).json({ club });
  } catch (err) { next(err); }
};

exports.updateClub = async (req, res, next) => {
  try {
    const club = await Club.findByPk(req.params.id);
    if (!club) return res.status(404).json({ error: 'Club not found' });
    await club.update(req.body);
    res.json({ club });
  } catch (err) { next(err); }
};

exports.deleteClub = async (req, res, next) => {
  try {
    const club = await Club.findByPk(req.params.id);
    if (!club) return res.status(404).json({ error: 'Club not found' });
    await club.update({ isActive: false });
    res.json({ message: 'Club deactivated' });
  } catch (err) { next(err); }
};
