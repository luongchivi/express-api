const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');
const {
  DB_TABLE_NAMES,
  getTableNameForMigrations,
} = require('../constants');


const OrderCoupon = sequelize.define(getTableNameForMigrations(DB_TABLE_NAMES.ORDER_COUPON), {
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
  couponId: {
    type: DataTypes.INTEGER,
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


module.exports = OrderCoupon;
