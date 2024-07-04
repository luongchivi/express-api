'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');
const {
  DB_TABLE_NAMES,
  getTableNameForMigrations
} = require('../constants');

const UserRole = sequelize.define(getTableNameForMigrations(DB_TABLE_NAMES.USER_ROLE), {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: getTableNameForMigrations(DB_TABLE_NAMES.USER),
      key: 'id'
    },
    allowNull: false
  },
  roleId: {
    type: DataTypes.INTEGER,
    references: {
      model: getTableNameForMigrations(DB_TABLE_NAMES.ROLE),
      key: 'id'
    },
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  timestamps: true,
  underscored: true
});

module.exports = UserRole;
