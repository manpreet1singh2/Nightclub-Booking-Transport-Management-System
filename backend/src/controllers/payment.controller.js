const Razorpay = require('razorpay');
const crypto = require('crypto');
const { Payment, Booking } = require('../models');
const whatsappService = require('../services/whatsapp.service');
const logger = require('../utils/logger');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findByPk(bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const amountPaise = Math.round(booking.advanceAmount * 100); // Razorpay uses paise

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: booking.bookingId,
      notes: { bookingId: booking.id, userId: req.user.id },
    });

    // Save order reference
    await Payment.create({
      bookingId: booking.id,
      razorpayOrderId: order.id,
      amount: booking.advanceAmount,
      currency: 'INR',
      status: 'created',
    });

    res.json({
      orderId: order.id,
      amount: amountPaise,
      currency: 'INR',
      bookingId: booking.bookingId,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    // Signature verification
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment signature verification failed' });
    }

    // Get payment details from Razorpay
    const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);

    // Update payment record
    const payment = await Payment.findOne({ where: { razorpayOrderId: razorpay_order_id } });
    if (payment) {
      await payment.update({
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'captured',
        method: paymentDetails.method,
        paidAt: new Date(),
      });
    }

    // Confirm booking
    const booking = await Booking.findByPk(bookingId);
    if (booking) {
      await booking.update({ status: 'confirmed' });
    }

    logger.info(`Payment verified: ${razorpay_payment_id} for booking ${bookingId}`);
    res.json({ success: true, message: 'Payment verified and booking confirmed!' });
  } catch (err) {
    next(err);
  }
};

exports.getPaymentStatus = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({ where: { bookingId: req.params.bookingId } });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json({ payment });
  } catch (err) { next(err); }
};

exports.handleWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const body = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    const event = req.body.event;
    logger.info(`Razorpay webhook: ${event}`);
    res.json({ status: 'ok' });
  } catch (err) { next(err); }
};
