const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Club = sequelize.define('Club', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    pincode: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ownerWhatsapp: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    openTime: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    closeTime: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    capacity: {
      type: DataTypes.INTEGER,
      defaultValue: 200,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0,
    },
    totalReviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    amenities: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  }, {
    tableName: 'clubs',
    timestamps: true,
  });

  return Club;
};
