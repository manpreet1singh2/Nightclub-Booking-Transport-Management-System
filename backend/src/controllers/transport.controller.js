const { Transport, Driver, Booking, User } = require('../models');
const whatsappService = require('../services/whatsapp.service');

exports.getAllTransports = async (req, res, next) => {
  try {
    const { status, date } = req.query;
    const where = {};
    if (status) where.status = status;

    const transports = await Transport.findAll({
      where,
      include: [
        { model: Booking, as: 'booking', include: [{ model: User, as: 'user', attributes: ['name', 'phone'] }] },
        { model: Driver, as: 'driver', attributes: ['name', 'phone', 'vehicleNumber', 'vehicleModel'] },
      ],
      order: [['pickupTime', 'ASC']],
    });

    res.json({ transports });
  } catch (err) { next(err); }
};

exports.getAvailableDrivers = async (req, res, next) => {
  try {
    const { type } = req.query;
    const where = { isAvailable: true, isActive: true };
    if (type) where.vehicleType = { $in: [type, 'both'] };

    const drivers = await Driver.findAll({ where, order: [['rating', 'DESC']] });
    res.json({ drivers });
  } catch (err) { next(err); }
};

exports.createDriver = async (req, res, next) => {
  try {
    const driver = await Driver.create(req.body);
    res.status(201).json({ driver });
  } catch (err) { next(err); }
};

exports.assignDriver = async (req, res, next) => {
  try {
    const { driverId } = req.body;
    const transport = await Transport.findByPk(req.params.id, {
      include: [{ model: Booking, as: 'booking', include: [{ model: User, as: 'user' }] }],
    });

    if (!transport) return res.status(404).json({ error: 'Transport booking not found' });

    const driver = await Driver.findByPk(driverId);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });

    await transport.update({ driverId, status: 'driver_assigned', driverNotified: true });
    await driver.update({ isAvailable: false });

    // Notify driver via WhatsApp
    if (driver.whatsapp) {
      await whatsappService.sendDriverAssignment(driver, transport, transport.booking);
    }

    res.json({ transport, message: 'Driver assigned successfully' });
  } catch (err) { next(err); }
};

exports.updateTransportStatus = async (req, res, next) => {
  try {
    const transport = await Transport.findByPk(req.params.id);
    if (!transport) return res.status(404).json({ error: 'Transport not found' });

    const { status } = req.body;
    await transport.update({ status, ...(status === 'completed' ? { completedAt: new Date() } : {}) });

    if (status === 'completed' && transport.driverId) {
      await Driver.update({ isAvailable: true }, { where: { id: transport.driverId } });
    }

    res.json({ transport });
  } catch (err) { next(err); }
};
