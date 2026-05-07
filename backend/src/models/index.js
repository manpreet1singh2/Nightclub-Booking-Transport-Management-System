const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'nightclub_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASS || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: (msg) => logger.debug(msg),
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Import models
const User = require('./User')(sequelize);
const Club = require('./Club')(sequelize);
const Package = require('./Package')(sequelize);
const Booking = require('./Booking')(sequelize);
const Transport = require('./Transport')(sequelize);
const Driver = require('./Driver')(sequelize);
const Payment = require('./Payment')(sequelize);
const Notification = require('./Notification')(sequelize);

// ─── Associations ─────────────────────────────────────────────────────────
// User <-> Booking
User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Club <-> Booking
Club.hasMany(Booking, { foreignKey: 'clubId', as: 'bookings' });
Booking.belongsTo(Club, { foreignKey: 'clubId', as: 'club' });

// Package <-> Booking
Package.hasMany(Booking, { foreignKey: 'packageId', as: 'bookings' });
Booking.belongsTo(Package, { foreignKey: 'packageId', as: 'package' });

// Club <-> Package
Club.hasMany(Package, { foreignKey: 'clubId', as: 'packages' });
Package.belongsTo(Club, { foreignKey: 'clubId', as: 'club' });

// Booking <-> Transport
Booking.hasOne(Transport, { foreignKey: 'bookingId', as: 'transport' });
Transport.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });

// Driver <-> Transport
Driver.hasMany(Transport, { foreignKey: 'driverId', as: 'transports' });
Transport.belongsTo(Driver, { foreignKey: 'driverId', as: 'driver' });

// Booking <-> Payment
Booking.hasOne(Payment, { foreignKey: 'bookingId', as: 'payment' });
Payment.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });

// User <-> Notification
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Club,
  Package,
  Booking,
  Transport,
  Driver,
  Payment,
  Notification,
};
