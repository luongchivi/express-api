const { DataTypes } = require('sequelize');
const {
  getTableNameForMigrations,
  DB_TABLE_NAMES,
} = require('../constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.addColumn(getTableNameForMigrations(DB_TABLE_NAMES.PRODUCT), 'average_rating', {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        validate: {
          max: 5,
        },
        allowNull: false,
      }, { transaction: t });
    });
  },

  async down(queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.removeColumn(getTableNameForMigrations(DB_TABLE_NAMES.PRODUCT), 'average_rating', { transaction: t });
    });
  },
};
