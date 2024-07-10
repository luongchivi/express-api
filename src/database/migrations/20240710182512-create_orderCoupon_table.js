const { DataTypes } = require('sequelize');
const {
  getTableNameForMigrations,
  DB_TABLE_NAMES,
} = require('../constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.createTable(getTableNameForMigrations(DB_TABLE_NAMES.ORDER_COUPON), {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        order_id: {
          type: DataTypes.INTEGER,
          references: {
            model: getTableNameForMigrations(DB_TABLE_NAMES.ORDER),
            key: 'id',
          },
          allowNull: false,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        coupon_id: {
          type: DataTypes.INTEGER,
          references: {
            model: getTableNameForMigrations(DB_TABLE_NAMES.COUPON),
            key: 'id',
          },
          allowNull: false,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      }, { transaction: t });

      // thêm ràng buộc vào order_id và coupon_id
      await queryInterface.addConstraint(getTableNameForMigrations(DB_TABLE_NAMES.ORDER_COUPON), {
        type: 'unique',
        name: 'order_coupon_unique_constraint',
        fields: ['order_id', 'coupon_id'],
        transaction: t,
      });
    });
  },

  async down(queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction(async t => {
      // xóa ràng buộc trước khi xóa table
      await queryInterface.removeConstraint(getTableNameForMigrations(DB_TABLE_NAMES.ORDER_COUPON), 'order_coupon_unique_constraint', { transaction: t });

      await queryInterface.dropTable(getTableNameForMigrations(DB_TABLE_NAMES.ORDER_COUPON), { transaction: t });
    });
  },
};
