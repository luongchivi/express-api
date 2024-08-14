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
    allowNull: false,
  },
  value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  emailAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  merchantId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  addressLineOne: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  adminAreaTwo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  adminAreaOne: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postalCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  countryCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  payerId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
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
