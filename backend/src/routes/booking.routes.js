const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const bookingController = require('../controllers/booking.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

// Create booking
router.post('/', authenticate, [
  body('clubId').isUUID().withMessage('Valid club ID required'),
  body('visitDate').isDate().withMessage('Valid date required'),
  body('visitTime').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Valid time (HH:MM) required'),
  body('numberOfPeople').isInt({ min: 1, max: 100 }).withMessage('Number of people must be 1-100'),
  body('guestType').isIn(['single', 'couple', 'group']).withMessage('Valid guest type required'),
  validate,
], bookingController.createBooking);

// Get user bookings
router.get('/my-bookings', authenticate, bookingController.getUserBookings);

// Get booking by ID
router.get('/:id', authenticate, bookingController.getBookingById);

// Cancel booking
router.patch('/:id/cancel', authenticate, bookingController.cancelBooking);

// Admin: Get all bookings
router.get('/', authenticate, authorize('club_owner', 'super_admin'), bookingController.getAllBookings);

// Admin: Update booking status
router.patch('/:id/status', authenticate, authorize('club_owner', 'super_admin'), [
  body('status').isIn(['confirmed', 'cancelled', 'completed', 'no_show']),
  validate,
], bookingController.updateBookingStatus);

// Export bookings to Excel
router.get('/export/excel', authenticate, authorize('club_owner', 'super_admin'), bookingController.exportToExcel);

module.exports = router;
