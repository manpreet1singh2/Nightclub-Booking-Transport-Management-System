const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Package = sequelize.define('Package', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    clubId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('entry_only', 'entry_drinks', 'entry_cab', 'entry_bike', 'full_combo'),
      allowNull: false,
    },
    pricePerPerson: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    priceCouple: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    priceGroup: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    includesTransport: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    includesDrinks: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    drinksAllowance: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    maxPeople: {
      type: DataTypes.INTEGER,
      defaultValue: 50,
    },
    features: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  }, {
    tableName: 'packages',
    timestamps: true,
  });

  return Package;
};
