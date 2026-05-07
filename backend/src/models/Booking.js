const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Booking = sequelize.define('Booking', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    bookingId: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    clubId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    packageId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    visitDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    visitTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    numberOfPeople: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 100 },
    },
    guestType: {
      type: DataTypes.ENUM('single', 'couple', 'group'),
      allowNull: false,
    },
    tableRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    transportRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    transportType: {
      type: DataTypes.ENUM('cab', 'bike', 'none'),
      defaultValue: 'none',
    },
    pickupLocation: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pickupLatitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    pickupLongitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    pickupTime: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed', 'no_show'),
      defaultValue: 'pending',
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    advanceAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    specialRequests: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    promoCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    discountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    qrCode: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    checkedIn: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    checkedInAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'bookings',
    timestamps: true,
    hooks: {
      beforeCreate: (booking) => {
        if (!booking.bookingId) {
          const timestamp = Date.now().toString(36).toUpperCase();
          const random = Math.random().toString(36).substr(2, 4).toUpperCase();
          booking.bookingId = `NV-${timestamp}-${random}`;
        }
        // 15% advance payment
        booking.advanceAmount = parseFloat((booking.totalAmount * 0.15).toFixed(2));
      },
    },
  });

  return Booking;
};
