const express = require('express');
const router = express.Router();
const transportController = require('../controllers/transport.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/', authenticate, authorize('club_owner', 'super_admin'), transportController.getAllTransports);
router.get('/drivers', authenticate, authorize('club_owner', 'super_admin'), transportController.getAvailableDrivers);
router.post('/drivers', authenticate, authorize('super_admin'), transportController.createDriver);
router.patch('/:id/assign', authenticate, authorize('club_owner', 'super_admin'), transportController.assignDriver);
router.patch('/:id/status', authenticate, transportController.updateTransportStatus);

module.exports = router;
