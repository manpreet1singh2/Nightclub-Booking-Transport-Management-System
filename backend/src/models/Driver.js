const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Driver = sequelize.define('Driver', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(100), allowNull: false },
    phone: { type: DataTypes.STRING(15), allowNull: false, unique: true },
    whatsapp: { type: DataTypes.STRING(15), allowNull: true },
    licenseNumber: { type: DataTypes.STRING(50), allowNull: false },
    vehicleType: { type: DataTypes.ENUM('cab', 'bike', 'both'), allowNull: false },
    vehicleNumber: { type: DataTypes.STRING(20), allowNull: false },
    vehicleModel: { type: DataTypes.STRING(100), allowNull: true },
    isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    rating: { type: DataTypes.DECIMAL(3, 2), defaultValue: 5.0 },
    totalTrips: { type: DataTypes.INTEGER, defaultValue: 0 },
    profileImage: { type: DataTypes.STRING(500), allowNull: true },
  }, {
    tableName: 'drivers',
    timestamps: true,
  });

  return Driver;
};
