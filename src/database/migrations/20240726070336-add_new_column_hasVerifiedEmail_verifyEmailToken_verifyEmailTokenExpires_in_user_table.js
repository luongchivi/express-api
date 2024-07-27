const { DataTypes } = require('sequelize');
const {
  getTableNameForMigrations,
  DB_TABLE_NAMES,
} = require('../constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.addColumn(getTableNameForMigrations(DB_TABLE_NAMES.USER), 'has_verified_email', {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }, { transaction: t });
      await queryInterface.addColumn(getTableNameForMigrations(DB_TABLE_NAMES.USER), 'verify_email_token', {
        type: DataTypes.STRING,
      }, { transaction: t });
      await queryInterface.addColumn(getTableNameForMigrations(DB_TABLE_NAMES.USER), 'verify_email_token_expires', {
        type: DataTypes.DATE,
      }, { transaction: t });
    });
  },

  async down(queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.removeColumn(getTableNameForMigrations(DB_TABLE_NAMES.USER), 'has_verified_email', { transaction: t });
      await queryInterface.removeColumn(getTableNameForMigrations(DB_TABLE_NAMES.USER), 'verify_email_token', { transaction: t });
      await queryInterface.removeColumn(getTableNameForMigrations(DB_TABLE_NAMES.USER), 'verify_email_token_expires', { transaction: t });
    });
  },
};
