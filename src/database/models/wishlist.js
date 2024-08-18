const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');
const { DB_TABLE_NAMES, getTableNameForMigrations } = require('../constants');
const User = require('./user');
const Product = require('./product');


const Wishlist = sequelize.define(getTableNameForMigrations(DB_TABLE_NAMES.WISHLIST), {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productId: {
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

Wishlist.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Wishlist, { foreignKey: 'userId', as: 'wishlistItems' });

Wishlist.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(Wishlist, { foreignKey: 'productId', as: 'wishlists' });


module.exports = Wishlist;
