const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const adminOnly = [authenticate, authorize('club_owner', 'super_admin')];
const superAdminOnly = [authenticate, authorize('super_admin')];

router.get('/dashboard', ...adminOnly, adminController.getDashboardStats);
router.get('/analytics', ...adminOnly, adminController.getAnalytics);
router.get('/users', ...superAdminOnly, adminController.getAllUsers);
router.patch('/users/:id/status', ...superAdminOnly, adminController.toggleUserStatus);
router.get('/notifications', ...adminOnly, adminController.getNotificationLogs);
router.post('/packages', ...adminOnly, adminController.createPackage);
router.put('/packages/:id', ...adminOnly, adminController.updatePackage);
router.delete('/packages/:id', ...superAdminOnly, adminController.deletePackage);

module.exports = router;
