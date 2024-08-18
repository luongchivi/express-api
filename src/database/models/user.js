require('dotenv').config({ path: `${process.cwd()}/.env` });
const {
  DataTypes,
} = require('sequelize');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sequelize = require('../../../config/database');
const {
  DB_TABLE_NAMES,
  getTableNameForMigrations,
} = require('../constants');
const Address = require('./address');
const Role = require('./role');
const UserRole = require('./userRole');
const Cart = require('./cart');
const Blog = require('./blog');
const Comment = require('./comment');
const TransactionPaypal = require('./transactionPaypal');


const User = sequelize.define(getTableNameForMigrations(DB_TABLE_NAMES.USER), {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
  },
  lastName: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  refreshToken: {
    type: DataTypes.STRING,
  },
  passwordResetToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  passwordResetTokenExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  passwordChangedAt: {
    type: DataTypes.DATE,
  },
  hasVerifiedEmail: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  verifyEmailToken: {
    type: DataTypes.STRING,
  },
  verifyEmailTokenExpires: {
    type: DataTypes.DATE,
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
  paranoid: true, // soft delete user
  underscored: true,
  timestamps: true,
  hooks: {
    beforeCreate: async user => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async user => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
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
  onUpdate: 'CASCADE',
});

Role.belongsToMany(User, {
  as: 'users',
  through: { model: UserRole, unique: true },
  foreignKey: 'roleId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// One to One, User và Cart
User.hasOne(Cart, { foreignKey: 'userId', as: 'cart' });
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.prototype.createPasswordChangeToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  console.log('Log PasswordResetTokenExpires: ', Date.now() + parseInt(process.env.PASSWORD_RESET_EXPIRES, 10));
  this.passwordResetTokenExpires = Date.now() + parseInt(process.env.PASSWORD_RESET_EXPIRES, 10);
  return resetToken;
};

// One to Many, User và Blog, 1 User có 1 hoặc nhiều Blog
User.hasMany(Blog, { foreignKey: 'userId', as: 'blogs' });
Blog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// One to Many, User và Comment, 1 User có 1 hoặc nhiều Comments
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// One to Many, User và TransactionPaypal, 1 User có 1 hoặc nhiều TransactionPaypal
User.hasMany(TransactionPaypal, { foreignKey: 'userId', as: 'transactionPaypal' });
TransactionPaypal.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = User;
