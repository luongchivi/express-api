const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');
const {
  DB_TABLE_NAMES,
  getTableNameForMigrations,
} = require('../constants');
const Comment = require('./comment');


const Blog = sequelize.define(getTableNameForMigrations(DB_TABLE_NAMES.BLOG), {
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
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
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

// One to Many, Blog và Comment, 1 Blog có 1 hoặc nhiều Comments
Blog.hasMany(Comment, { foreignKey: 'blogId', as: 'comments' });
Comment.belongsTo(Blog, { foreignKey: 'blogId', as: 'blog' });

module.exports = Blog;
