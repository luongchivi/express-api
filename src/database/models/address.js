const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');
const {
  DB_TABLE_NAMES,
  getTableNameForMigrations,
} = require('../constants');


const Address = sequelize.define(getTableNameForMigrations(DB_TABLE_NAMES.ADDRESS), {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    unique: true,
  },
  address: {
    type: DataTypes.STRING,
  },
  wardId: {
    type: DataTypes.INTEGER,
  },
  districtId: {
    type: DataTypes.INTEGER,
  },
  provinceId: {
    type: DataTypes.INTEGER,
  },
  phone: {
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

module.exports = Address;
