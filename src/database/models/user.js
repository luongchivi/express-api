'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');
const {
  DB_TABLE_NAMES,
  getTableNameForMigrations
} = require('../constants');
const Address = require('./address');
const Role = require('./role');
const UserRole = require('./userRole');

const User = sequelize.define(getTableNameForMigrations(DB_TABLE_NAMES.USER), {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING
  },
  lastName: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING,
    unique: true
  },
  password: {
    type: DataTypes.STRING
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
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
  paranoid: true, // soft delete user
  underscored: true,
  timestamps: true
});

// One to One, User và Address
User.hasOne(Address, { foreignKey: 'userId', as: 'address' });
Address.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Many to Many, User và Role thông qua bảng trung gian UserRole
User.belongsToMany(Role, {
  as: 'roles',
  through: { model: UserRole, unique: true },
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Role.belongsToMany(User, {
  as: 'users',
  through: { model: UserRole, unique: true },
  foreignKey: 'roleId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

module.exports = User;
