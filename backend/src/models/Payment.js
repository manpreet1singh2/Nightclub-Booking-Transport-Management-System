const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    bookingId: { type: DataTypes.UUID, allowNull: false },
    razorpayOrderId: { type: DataTypes.STRING(100), allowNull: true },
    razorpayPaymentId: { type: DataTypes.STRING(100), allowNull: true },
    razorpaySignature: { type: DataTypes.STRING(500), allowNull: true },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    currency: { type: DataTypes.STRING(5), defaultValue: 'INR' },
    method: {
      type: DataTypes.ENUM('upi', 'card', 'wallet', 'netbanking', 'cash'),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('created', 'authorized', 'captured', 'refunded', 'failed'),
      defaultValue: 'created',
    },
    paidAt: { type: DataTypes.DATE, allowNull: true },
    refundId: { type: DataTypes.STRING(100), allowNull: true },
    refundAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    refundedAt: { type: DataTypes.DATE, allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
  }, {
    tableName: 'payments',
    timestamps: true,
  });

  return Payment;
};
