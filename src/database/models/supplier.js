const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');
const {
  DB_TABLE_NAMES,
  getTableNameForMigrations,
} = require('../constants');


const Supplier = sequelize.define(getTableNameForMigrations(DB_TABLE_NAMES.SUPPLIER), {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  companyName: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  contactName: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
  },
  city: {
    type: DataTypes.STRING,
  },
  region: {
    type: DataTypes.STRING,
  },
  postalCode: {
    type: DataTypes.STRING,
  },
  country: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING,
  },
  fax: {
    type: DataTypes.STRING,
  },
  homePage: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  timestamps: true,
  underscored: true,
});

module.exports = Supplier;
