const { DataTypes } = require('sequelize');
const {
  getTableNameForMigrations,
  DB_TABLE_NAMES,
} = require('../constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.createTable(getTableNameForMigrations(DB_TABLE_NAMES.COUPON), {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        code: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        discount: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        expiry: {
          type: DataTypes.DATE,
          allowNull: false,
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
    });
  },

  async down(queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.dropTable(getTableNameForMigrations(DB_TABLE_NAMES.COUPON), { transaction: t });
    });
  },
};
