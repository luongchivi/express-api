const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');
const {
  DB_TABLE_NAMES,
  getTableNameForMigrations,
} = require('../constants');


const Coupon = sequelize.define(getTableNameForMigrations(DB_TABLE_NAMES.COUPON), {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  discount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  expiry: {
    type: DataTypes.DATE,
    allowNull: false,
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

module.exports = Coupon;
