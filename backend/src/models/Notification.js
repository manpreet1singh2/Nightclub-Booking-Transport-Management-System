const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: { type: DataTypes.UUID, allowNull: true },
    bookingId: { type: DataTypes.UUID, allowNull: true },
    type: {
      type: DataTypes.ENUM('booking_confirmed', 'booking_cancelled', 'payment_received', 'transport_assigned', 'pickup_reminder', 'general'),
      allowNull: false,
    },
    channel: {
      type: DataTypes.ENUM('whatsapp', 'sms', 'email', 'push'),
      allowNull: false,
    },
    recipient: { type: DataTypes.STRING(255), allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    status: {
      type: DataTypes.ENUM('pending', 'sent', 'failed', 'delivered'),
      defaultValue: 'pending',
    },
    sentAt: { type: DataTypes.DATE, allowNull: true },
    errorMessage: { type: DataTypes.TEXT, allowNull: true },
    metadata: { type: DataTypes.JSONB, defaultValue: {} },
  }, {
    tableName: 'notifications',
    timestamps: true,
  });

  return Notification;
};
