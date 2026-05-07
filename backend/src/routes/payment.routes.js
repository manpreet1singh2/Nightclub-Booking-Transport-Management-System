const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Create Razorpay order
router.post('/create-order', authenticate, paymentController.createOrder);

// Verify payment
router.post('/verify', authenticate, paymentController.verifyPayment);

// Payment status
router.get('/:bookingId/status', authenticate, paymentController.getPaymentStatus);

// Razorpay webhook (no auth — Razorpay calls this)
router.post('/webhook', paymentController.handleWebhook);

module.exports = router;
