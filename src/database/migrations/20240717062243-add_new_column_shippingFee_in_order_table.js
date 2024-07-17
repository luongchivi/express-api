const { DataTypes } = require('sequelize');
const {
  getTableNameForMigrations,
  DB_TABLE_NAMES,
} = require('../constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.addColumn(getTableNameForMigrations(DB_TABLE_NAMES.ORDER), 'shipping_fee', {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
      }, { transaction: t });
      await queryInterface.addColumn(getTableNameForMigrations(DB_TABLE_NAMES.ORDER), 'shipping_order_id', {
        type: DataTypes.STRING,
      }, { transaction: t });
      await queryInterface.addColumn(getTableNameForMigrations(DB_TABLE_NAMES.ORDER), 'expected_delivery_time', {
        type: DataTypes.DATE,
      }, { transaction: t });
    });
  },

  async down (queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.removeColumn(getTableNameForMigrations(DB_TABLE_NAMES.ORDER), 'shipping_fee',  { transaction: t });
      await queryInterface.removeColumn(getTableNameForMigrations(DB_TABLE_NAMES.ORDER), 'shipping_order_id',  { transaction: t });
      await queryInterface.removeColumn(getTableNameForMigrations(DB_TABLE_NAMES.ORDER), 'expected_delivery_time',  { transaction: t });
    });
  }
};
