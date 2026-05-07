const twilio = require('twilio');
const { Notification } = require('../models');
const logger = require('../utils/logger');

const client = process.env.TWILIO_ACCOUNT_SID
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const FROM = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';

async function sendWhatsApp(to, message, metadata = {}) {
  const formattedTo = `whatsapp:+91${to.replace(/^(\+91|91)/, '')}`;
  try {
    if (!client) {
      logger.warn('Twilio not configured — WhatsApp message skipped');
      return;
    }
    const msg = await client.messages.create({ from: FROM, to: formattedTo, body: message });
    await Notification.create({
      type: metadata.type || 'general',
      channel: 'whatsapp',
      recipient: formattedTo,
      message,
      status: 'sent',
      sentAt: new Date(),
      bookingId: metadata.bookingId,
      userId: metadata.userId,
      metadata,
    });
    logger.info(`WhatsApp sent to ${formattedTo}: ${msg.sid}`);
  } catch (err) {
    logger.error(`WhatsApp failed to ${formattedTo}:`, err.message);
    await Notification.create({
      type: metadata.type || 'general',
      channel: 'whatsapp',
      recipient: formattedTo,
      message,
      status: 'failed',
      errorMessage: err.message,
      bookingId: metadata.bookingId,
      userId: metadata.userId,
      metadata,
    });
  }
}

exports.sendBookingConfirmation = async (user, booking, club) => {
  const transport = booking.transportRequired
    ? `\n🚗 *Transport:* ${booking.transportType.toUpperCase()}\n📍 *Pickup:* ${booking.pickupLocation}\n⏰ *Pickup Time:* ${booking.pickupTime}`
    : '';

  const message = `🌙 *NightVibe Booking Confirmed!*

🎉 Hello ${user.name}! Your booking is confirmed.

━━━━━━━━━━━━━━━━━━
📋 *BOOKING DETAILS*
━━━━━━━━━━━━━━━━━━
🎟️ *Booking ID:* ${booking.bookingId}
🏠 *Club:* ${club.name}
📅 *Date:* ${new Date(booking.visitDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
⏰ *Time:* ${booking.visitTime}
👥 *Guests:* ${booking.numberOfPeople} (${booking.guestType})
💰 *Total:* ₹${booking.totalAmount}
✅ *Advance Paid:* ₹${booking.advanceAmount}${transport}

━━━━━━━━━━━━━━━━━━
📍 *Venue Address*
━━━━━━━━━━━━━━━━━━
${club.address}

See you tonight! 🎵✨
_NightVibe Team_`;

  await sendWhatsApp(user.phone, message, {
    type: 'booking_confirmed',
    bookingId: booking.id,
    userId: user.id,
  });
};

exports.sendOwnerAlert = async (booking, user, club) => {
  if (!club.ownerWhatsapp) return;

  const message = `🔔 *NEW BOOKING ALERT!*

━━━━━━━━━━━━━━━━━━
📋 *Booking ID:* ${booking.bookingId}
━━━━━━━━━━━━━━━━━━
👤 *Customer:* ${user.name}
📱 *Phone:* +91${user.phone}
📅 *Visit Date:* ${booking.visitDate}
⏰ *Visit Time:* ${booking.visitTime}
👥 *Guests:* ${booking.numberOfPeople} (${booking.guestType})
🚗 *Transport:* ${booking.transportType}
${booking.pickupLocation ? `📍 *Pickup:* ${booking.pickupLocation}` : ''}
💰 *Amount:* ₹${booking.totalAmount}
✅ *Advance:* ₹${booking.advanceAmount}

_NightVibe System_`;

  await sendWhatsApp(club.ownerWhatsapp, message, {
    type: 'booking_confirmed',
    bookingId: booking.id,
  });
};

exports.sendDriverAssignment = async (driver, transport, booking) => {
  const message = `🚗 *PICKUP ASSIGNMENT — NightVibe*

Hello ${driver.name}!

━━━━━━━━━━━━━━━━━━
📋 *TRIP DETAILS*
━━━━━━━━━━━━━━━━━━
🎟️ *Booking:* ${booking.bookingId}
👤 *Customer:* ${booking.user?.name}
📱 *Phone:* +91${booking.user?.phone}
📍 *Pickup:* ${transport.pickupLocation}
⏰ *Pickup Time:* ${transport.pickupTime}
🚗 *Vehicle Type:* ${transport.type.toUpperCase()}

Please be on time! 🙏
_NightVibe Transport_`;

  await sendWhatsApp(driver.phone, message, {
    type: 'transport_assigned',
    bookingId: booking.id,
  });
};

exports.sendPickupReminder = async (user, transport, booking) => {
  const message = `⏰ *PICKUP REMINDER — NightVibe*

Hello ${user.name}!

Your driver will arrive in *30 minutes* for your pickup at:
📍 ${transport.pickupLocation}
⏰ *Pickup Time:* ${transport.pickupTime}

🚗 *Driver:* ${transport.driver?.name}
📞 *Driver Phone:* ${transport.driver?.phone}
🚙 *Vehicle:* ${transport.driver?.vehicleModel} (${transport.driver?.vehicleNumber})

Get ready! 🎉
_NightVibe Transport_`;

  await sendWhatsApp(user.phone, message, {
    type: 'pickup_reminder',
    bookingId: booking.id,
    userId: user.id,
  });
};
