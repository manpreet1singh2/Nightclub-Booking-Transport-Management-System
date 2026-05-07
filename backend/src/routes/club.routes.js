const express = require('express');
const router = express.Router();
const clubController = require('../controllers/club.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Public
router.get('/', clubController.getAllClubs);
router.get('/:id', clubController.getClubById);
router.get('/:id/packages', clubController.getClubPackages);
router.get('/:id/availability', clubController.checkAvailability);

// Admin only
router.post('/', authenticate, authorize('super_admin'), clubController.createClub);
router.put('/:id', authenticate, authorize('super_admin', 'club_owner'), clubController.updateClub);
router.delete('/:id', authenticate, authorize('super_admin'), clubController.deleteClub);

module.exports = router;
