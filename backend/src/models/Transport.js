const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Transport = sequelize.define('Transport', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    bookingId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    driverId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('cab', 'bike'),
      allowNull: false,
    },
    pickupLocation: {
      type: DataTypes.TEXT,
      allowNull: false,
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
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'driver_assigned', 'en_route', 'arrived', 'completed', 'cancelled'),
      defaultValue: 'scheduled',
    },
    driverNotified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    customerNotified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    estimatedArrival: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'transports',
    timestamps: true,
  });

  return Transport;
};
