const { DataTypes } = require('sequelize');
const {
  getTableNameForMigrations,
  DB_TABLE_NAMES,
} = require('../constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.createTable(getTableNameForMigrations(DB_TABLE_NAMES.CATEGORY), {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
        },
        icon_image_url: {
          type: DataTypes.STRING,
          defaultValue: '',
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
      await queryInterface.dropTable(getTableNameForMigrations(DB_TABLE_NAMES.CATEGORY), { transaction: t });
    });
  },
};
