'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');
const {
  DB_TABLE_NAMES,
  getTableNameForMigrations
} = require('../constants');

const RolePermission = sequelize.define(getTableNameForMigrations(DB_TABLE_NAMES.ROLE_PERMISSION), {
  roleId: {
    type: DataTypes.INTEGER,
    references: {
      model: getTableNameForMigrations(DB_TABLE_NAMES.ROLE),
      key: 'id'
    },
    allowNull: false
  },
  permissionId: {
    type: DataTypes.INTEGER,
    references: {
      model: getTableNameForMigrations(DB_TABLE_NAMES.PERMISSION),
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
  underscored: true,
})

module.exports = RolePermission;
