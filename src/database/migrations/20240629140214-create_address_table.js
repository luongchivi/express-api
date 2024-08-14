const { DataTypes } = require('sequelize');
const {
  getTableNameForMigrations,
  DB_TABLE_NAMES,
} = require('../constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.createTable(getTableNameForMigrations(DB_TABLE_NAMES.ADDRESS), {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        user_id: {
          type: DataTypes.INTEGER,
          unique: true,
          references: {
            model: getTableNameForMigrations(DB_TABLE_NAMES.USER),
            key: 'id',
          },
        },
        address: {
          type: DataTypes.STRING,
        },
        ward_id: {
          type: DataTypes.STRING,
          references: {
            model: getTableNameForMigrations(DB_TABLE_NAMES.WARD),
            key: 'id',
          },
          allowNull: false,
        },
        district_id: {
          type: DataTypes.STRING,
          references: {
            model: getTableNameForMigrations(DB_TABLE_NAMES.DISTRICT),
            key: 'id',
          },
          allowNull: false,
        },
        province_id: {
          type: DataTypes.STRING,
          references: {
            model: getTableNameForMigrations(DB_TABLE_NAMES.PROVINCE),
            key: 'id',
          },
          allowNull: false,
        },
        phone: {
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
      await queryInterface.dropTable(getTableNameForMigrations(DB_TABLE_NAMES.ADDRESS), { transaction: t });
    });
  },
};
