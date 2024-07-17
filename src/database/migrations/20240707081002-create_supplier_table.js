const { DataTypes } = require('sequelize');
const {
  getTableNameForMigrations,
  DB_TABLE_NAMES,
} = require('../constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.createTable(getTableNameForMigrations(DB_TABLE_NAMES.SUPPLIER), {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        company_name: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false,
        },
        contact_name: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false,
        },
        address: {
          type: DataTypes.STRING,
        },
        city: {
          type: DataTypes.STRING,
        },
        region: {
          type: DataTypes.STRING,
        },
        postal_code: {
          type: DataTypes.STRING,
        },
        country: {
          type: DataTypes.STRING,
        },
        phone: {
          type: DataTypes.STRING,
        },
        fax: {
          type: DataTypes.STRING,
        },
        home_page: {
          type: DataTypes.STRING,
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
      await queryInterface.dropTable(getTableNameForMigrations(DB_TABLE_NAMES.SUPPLIER), { transaction: t });
    });
  },
};
