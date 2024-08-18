const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');
const {
  DB_TABLE_NAMES,
  getTableNameForMigrations,
} = require('../constants');
const {
  paymentType,
  orderStatus,
} = require('../../routes/order/orderSchema');
const User = require('./user');
const OrderItem = require('./orderItem');
const TransactionPaypal = require('./transactionPaypal');


const Order = sequelize.define(getTableNameForMigrations(DB_TABLE_NAMES.ORDER), {
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
  paymentType: {
    type: DataTypes.ENUM(...Object.values(paymentType)),
  },
  orderStatus: {
    type: DataTypes.ENUM(...Object.values(orderStatus)),
    defaultValue: orderStatus.PROCESSING,
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  shippingOrderId: {
    type: DataTypes.STRING,
  },
  expectedDeliveryTime: {
    type: DataTypes.DATE,
  },
  shippingFee: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
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

// One to Many, User và Order, 1 User có thể có 1 hoặc nhiều Order
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });

// One to Many, Order và OrderItem, 1 Order có thể có 1 hoặc nhiều OrderItem
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'orderItems' });

// Many to One, Product và Category nhiều sản phẩm ứng với 1 danh mục
TransactionPaypal.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
Order.hasMany(TransactionPaypal, { foreignKey: 'orderId', as: 'transactionPayPals' });

module.exports = Order;
