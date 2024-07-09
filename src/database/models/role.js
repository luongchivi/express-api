const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');
const {
  DB_TABLE_NAMES,
  getTableNameForMigrations,
} = require('../constants');
const Permission = require('./permission');
const RolePermission = require('./rolePermission');


const Role = sequelize.define(getTableNameForMigrations(DB_TABLE_NAMES.ROLE), {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
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

Role.belongsToMany(Permission, {
  as: 'permissions',
  through: { model: RolePermission, unique: true },
  foreignKey: 'roleId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Permission.belongsToMany(Role, {
  as: 'roles',
  through: { model: RolePermission, unique: true },
  foreignKey: 'permissionId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

module.exports = Role;
