const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');
const {
  DB_TABLE_NAMES,
  getTableNameForMigrations,
} = require('../constants');
const Supplier = require('./supplier');
const Category = require('./category');


const Product = sequelize.define(getTableNameForMigrations(DB_TABLE_NAMES.PRODUCT), {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  supplierId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  thumbImageUrl: {
    type: DataTypes.STRING,
  },
  imagesUrl: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  unitPrice: {
    type: DataTypes.FLOAT,
    required: true,
  },
  unitsInStock: {
    type: DataTypes.INTEGER,
    defaultValue: 100,
    allowNull: false,
  },
  unitsOnOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  unitsSold: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 25,
    validate: {
      max: 50000,
    },
  },
  length: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 10,
    validate: {
      max: 200,
    },
  },
  width: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 10,
    validate: {
      max: 200,
    },
  },
  height: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 10,
    validate: {
      max: 200,
    },
  },
  averageRating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    validate: {
      max: 5,
    },
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

// Many to One, Product và Supplier nhiều sản phẩn cùng cung cấp tại 1 nhà phân phối
Product.belongsTo(Supplier, { foreignKey: 'supplierId', as: 'supplier', onDelete: 'SET NULL' });
Supplier.hasMany(Product, { foreignKey: 'supplierId', as: 'products', onDelete: 'SET NULL' });

// Many to One, Product và Category nhiều sản phẩm ứng với 1 danh mục
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });

module.exports = Product;
