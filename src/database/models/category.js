const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');
const {
  DB_TABLE_NAMES,
  getTableNameForMigrations,
} = require('../constants');
const Supplier = require('./supplier');
const CategorySupplier = require('./categorySupplier');


const Category = sequelize.define(getTableNameForMigrations(DB_TABLE_NAMES.CATEGORY), {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  iconImageUrl: {
    type: DataTypes.STRING,
  },
  thumbImageUrl: {
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

// Many to Many, Category và Supplier thông qua bảng trung gian CategorySupplier
Category.belongsToMany(Supplier, {
  as: 'suppliers',
  through: { model: CategorySupplier, unique: true },
  foreignKey: 'categoryId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Supplier.belongsToMany(Category, {
  as: 'categories',
  through: { model: CategorySupplier, unique: true },
  foreignKey: 'supplierId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

module.exports = Category;
