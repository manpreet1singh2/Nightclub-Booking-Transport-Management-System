const { Booking, User, Club, Payment, Transport, Notification, Package } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date();
    const monthStart = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);

    const [
      totalBookings,
      todayBookings,
      monthBookings,
      totalRevenue,
      monthRevenue,
      pendingTransports,
      totalUsers,
      activeClubs,
    ] = await Promise.all([
      Booking.count(),
      Booking.count({ where: { visitDate: today } }),
      Booking.count({ where: { createdAt: { [Op.gte]: monthStart } } }),
      Payment.sum('amount', { where: { status: 'captured' } }),
      Payment.sum('amount', { where: { status: 'captured', paidAt: { [Op.gte]: monthStart } } }),
      Transport.count({ where: { status: { [Op.in]: ['scheduled', 'driver_assigned'] } } }),
      User.count({ where: { role: 'customer' } }),
      Club.count({ where: { isActive: true } }),
    ]);

    // Booking status breakdown
    const statusBreakdown = await Booking.findAll({
      attributes: ['status', [fn('COUNT', col('id')), 'count']],
      group: ['status'],
      raw: true,
    });

    // Last 7 days bookings
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentBookings = await Booking.findAll({
      where: { createdAt: { [Op.gte]: sevenDaysAgo } },
      include: [
        { model: User, as: 'user', attributes: ['name', 'phone'] },
        { model: Club, as: 'club', attributes: ['name'] },
      ],
      order: [['createdAt', 'DESC']],
      limit: 10,
    });

    res.json({
      stats: {
        totalBookings,
        todayBookings,
        monthBookings,
        totalRevenue: totalRevenue || 0,
        monthRevenue: monthRevenue || 0,
        pendingTransports,
        totalUsers,
        activeClubs,
      },
      statusBreakdown,
      recentBookings,
    });
  } catch (err) { next(err); }
};

exports.getAnalytics = async (req, res, next) => {
  try {
    const { period = '30' } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    const dailyBookings = await Booking.findAll({
      attributes: [
        [fn('DATE', col('createdAt')), 'date'],
        [fn('COUNT', col('id')), 'count'],
        [fn('SUM', col('totalAmount')), 'revenue'],
      ],
      where: { createdAt: { [Op.gte]: daysAgo } },
      group: [fn('DATE', col('createdAt'))],
      order: [[fn('DATE', col('createdAt')), 'ASC']],
      raw: true,
    });

    const packagePopularity = await Booking.findAll({
      attributes: ['packageId', [fn('COUNT', col('Booking.id')), 'count']],
      include: [{ model: Package, as: 'package', attributes: ['name', 'type'] }],
      where: { packageId: { [Op.ne]: null } },
      group: ['packageId', 'package.id'],
      order: [[fn('COUNT', col('Booking.id')), 'DESC']],
      limit: 5,
    });

    const transportStats = await Booking.findAll({
      attributes: ['transportType', [fn('COUNT', col('id')), 'count']],
      group: ['transportType'],
      raw: true,
    });

    res.json({ dailyBookings, packagePopularity, transportStats });
  } catch (err) { next(err); }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const where = {};
    if (role) where.role = role;
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    res.json({ users: rows, pagination: { total: count, page: parseInt(page), pages: Math.ceil(count / limit) } });
  } catch (err) { next(err); }
};

exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.update({ isActive: !user.isActive });
    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user: user.toSafeJSON() });
  } catch (err) { next(err); }
};

exports.getNotificationLogs = async (req, res, next) => {
  try {
    const notifications = await Notification.findAll({
      order: [['createdAt', 'DESC']],
      limit: 100,
    });
    res.json({ notifications });
  } catch (err) { next(err); }
};

exports.createPackage = async (req, res, next) => {
  try {
    const pkg = await Package.create(req.body);
    res.status(201).json({ package: pkg });
  } catch (err) { next(err); }
};

exports.updatePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findByPk(req.params.id);
    if (!pkg) return res.status(404).json({ error: 'Package not found' });
    await pkg.update(req.body);
    res.json({ package: pkg });
  } catch (err) { next(err); }
};

exports.deletePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findByPk(req.params.id);
    if (!pkg) return res.status(404).json({ error: 'Package not found' });
    await pkg.update({ isActive: false });
    res.json({ message: 'Package deactivated' });
  } catch (err) { next(err); }
};
