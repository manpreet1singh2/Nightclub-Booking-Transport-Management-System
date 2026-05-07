const { Booking, Club, Package, Transport, Payment, User } = require('../models');
const { Op } = require('sequelize');
const ExcelJS = require('exceljs');
const whatsappService = require('../services/whatsapp.service');
const logger = require('../utils/logger');

exports.createBooking = async (req, res, next) => {
  try {
    const {
      clubId, packageId, visitDate, visitTime, numberOfPeople,
      guestType, tableRequired, transportType, pickupLocation,
      pickupLatitude, pickupLongitude, pickupTime, specialRequests, promoCode,
    } = req.body;

    const club = await Club.findByPk(clubId);
    if (!club) return res.status(404).json({ error: 'Club not found' });

    let pkg = null;
    let totalAmount = 0;

    if (packageId) {
      pkg = await Package.findByPk(packageId);
      if (!pkg) return res.status(404).json({ error: 'Package not found' });

      if (guestType === 'couple' && pkg.priceCouple) {
        totalAmount = parseFloat(pkg.priceCouple);
      } else if (guestType === 'group' && pkg.priceGroup) {
        totalAmount = parseFloat(pkg.priceGroup) * numberOfPeople;
      } else {
        totalAmount = parseFloat(pkg.pricePerPerson) * numberOfPeople;
      }
    } else {
      totalAmount = 500 * numberOfPeople; // Default base price
    }

    const transportRequired = transportType && transportType !== 'none';

    const booking = await Booking.create({
      userId: req.user.id,
      clubId,
      packageId: packageId || null,
      visitDate,
      visitTime,
      numberOfPeople,
      guestType,
      tableRequired: tableRequired || false,
      transportRequired,
      transportType: transportType || 'none',
      pickupLocation: transportRequired ? pickupLocation : null,
      pickupLatitude: transportRequired ? pickupLatitude : null,
      pickupLongitude: transportRequired ? pickupLongitude : null,
      pickupTime: transportRequired ? pickupTime : null,
      totalAmount,
      specialRequests,
      promoCode,
    });

    // Create transport record if required
    if (transportRequired) {
      await Transport.create({
        bookingId: booking.id,
        type: transportType,
        pickupLocation,
        pickupLatitude,
        pickupLongitude,
        pickupTime,
        status: 'scheduled',
      });
    }

    // Send WhatsApp notifications (async, don't await)
    whatsappService.sendBookingConfirmation(req.user, booking, club).catch(logger.error);
    whatsappService.sendOwnerAlert(booking, req.user, club).catch(logger.error);

    const fullBooking = await Booking.findByPk(booking.id, {
      include: [
        { model: Club, as: 'club', attributes: ['name', 'address', 'phone'] },
        { model: Package, as: 'package', attributes: ['name', 'type'] },
        { model: Transport, as: 'transport' },
      ],
    });

    logger.info(`Booking created: ${booking.bookingId} by user ${req.user.email}`);
    res.status(201).json({ booking: fullBooking, message: 'Booking created successfully!' });
  } catch (err) {
    next(err);
  }
};

exports.getUserBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const where = { userId: req.user.id };
    if (status) where.status = status;

    const { count, rows } = await Booking.findAndCountAll({
      where,
      include: [
        { model: Club, as: 'club', attributes: ['name', 'address', 'city', 'images'] },
        { model: Package, as: 'package', attributes: ['name', 'type', 'features'] },
        { model: Transport, as: 'transport' },
        { model: Payment, as: 'payment', attributes: ['status', 'amount', 'method', 'paidAt'] },
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    res.json({
      bookings: rows,
      pagination: { total: count, page: parseInt(page), pages: Math.ceil(count / limit) },
    });
  } catch (err) {
    next(err);
  }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['name', 'email', 'phone'] },
        { model: Club, as: 'club' },
        { model: Package, as: 'package' },
        { model: Transport, as: 'transport' },
        { model: Payment, as: 'payment' },
      ],
    });

    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    // Only owner, admin, or the booking user can view
    if (
      req.user.role === 'customer' &&
      booking.userId !== req.user.id
    ) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ booking });
  } catch (err) {
    next(err);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    if (booking.userId !== req.user.id && req.user.role === 'customer') {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (['cancelled', 'completed'].includes(booking.status)) {
      return res.status(400).json({ error: `Booking is already ${booking.status}` });
    }

    await booking.update({ status: 'cancelled' });
    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (err) {
    next(err);
  }
};

exports.getAllBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, clubId, date, search } = req.query;
    const where = {};

    if (status) where.status = status;
    if (clubId) where.clubId = clubId;
    if (date) where.visitDate = date;
    if (search) {
      where[Op.or] = [
        { bookingId: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Booking.findAndCountAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['name', 'email', 'phone'] },
        { model: Club, as: 'club', attributes: ['name', 'city'] },
        { model: Package, as: 'package', attributes: ['name'] },
        { model: Transport, as: 'transport' },
        { model: Payment, as: 'payment', attributes: ['status', 'amount'] },
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    res.json({
      bookings: rows,
      pagination: { total: count, page: parseInt(page), pages: Math.ceil(count / limit) },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateBookingStatus = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    await booking.update({ status: req.body.status });
    res.json({ booking, message: 'Booking status updated' });
  } catch (err) {
    next(err);
  }
};

exports.exportToExcel = async (req, res, next) => {
  try {
    const { startDate, endDate, clubId } = req.query;
    const where = {};
    if (clubId) where.clubId = clubId;
    if (startDate && endDate) {
      where.visitDate = { [Op.between]: [startDate, endDate] };
    }

    const bookings = await Booking.findAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['name', 'email', 'phone'] },
        { model: Club, as: 'club', attributes: ['name'] },
        { model: Package, as: 'package', attributes: ['name'] },
        { model: Payment, as: 'payment', attributes: ['status', 'amount', 'method'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'NightVibe System';
    const sheet = workbook.addWorksheet('Bookings', {
      pageSetup: { paperSize: 9, orientation: 'landscape' },
    });

    // Header row styling
    sheet.columns = [
      { header: 'Booking ID', key: 'bookingId', width: 18 },
      { header: 'Customer Name', key: 'name', width: 22 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Email', key: 'email', width: 28 },
      { header: 'Club', key: 'club', width: 20 },
      { header: 'Visit Date', key: 'visitDate', width: 14 },
      { header: 'Visit Time', key: 'visitTime', width: 12 },
      { header: 'People', key: 'numberOfPeople', width: 10 },
      { header: 'Guest Type', key: 'guestType', width: 12 },
      { header: 'Package', key: 'package', width: 20 },
      { header: 'Transport', key: 'transportType', width: 12 },
      { header: 'Pickup Location', key: 'pickupLocation', width: 25 },
      { header: 'Total Amount (₹)', key: 'totalAmount', width: 16 },
      { header: 'Advance Paid (₹)', key: 'advanceAmount', width: 16 },
      { header: 'Payment Status', key: 'paymentStatus', width: 15 },
      { header: 'Booking Status', key: 'status', width: 15 },
      { header: 'Booked On', key: 'createdAt', width: 20 },
    ];

    // Style header row
    sheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A1A2E' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' }, left: { style: 'thin' },
        bottom: { style: 'thin' }, right: { style: 'thin' },
      };
    });
    sheet.getRow(1).height = 25;

    // Data rows
    bookings.forEach((b, index) => {
      const row = sheet.addRow({
        bookingId: b.bookingId,
        name: b.user?.name || 'N/A',
        phone: b.user?.phone || 'N/A',
        email: b.user?.email || 'N/A',
        club: b.club?.name || 'N/A',
        visitDate: b.visitDate,
        visitTime: b.visitTime,
        numberOfPeople: b.numberOfPeople,
        guestType: b.guestType,
        package: b.package?.name || 'Basic Entry',
        transportType: b.transportType,
        pickupLocation: b.pickupLocation || '—',
        totalAmount: parseFloat(b.totalAmount),
        advanceAmount: parseFloat(b.advanceAmount),
        paymentStatus: b.payment?.status || 'pending',
        status: b.status,
        createdAt: new Date(b.createdAt).toLocaleString('en-IN'),
      });

      if (index % 2 === 0) {
        row.eachCell((cell) => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8F9FA' } };
        });
      }
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="NightVibe_Bookings_${Date.now()}.xlsx"`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    next(err);
  }
};
