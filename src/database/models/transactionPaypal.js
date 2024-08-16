const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');
const {
  DB_TABLE_NAMES,
  getTableNameForMigrations,
} = require('../constants');


const TransactionPaypal = sequelize.define(getTableNameForMigrations(DB_TABLE_NAMES.TRANSACTION_PAYPAL), {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  paypalId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  intent: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  currencyCode: {
    type: DataTypes.STRING,
  },
  value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  emailAddress: {
    type: DataTypes.STRING,
  },
  merchantId: {
    type: DataTypes.STRING,
  },
  fullName: {
    type: DataTypes.STRING,
  },
  addressLineOne: {
    type: DataTypes.STRING,
  },
  adminAreaTwo: {
    type: DataTypes.STRING,
  },
  adminAreaOne: {
    type: DataTypes.STRING,
  },
  postalCode: {
    type: DataTypes.STRING,
  },
  countryCode: {
    type: DataTypes.STRING,
  },
  payerId: {
    type: DataTypes.STRING,
  },
  phoneNumber: {
    type: DataTypes.STRING,
  },
  rawResponse: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
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


module.exports = TransactionPaypal;
