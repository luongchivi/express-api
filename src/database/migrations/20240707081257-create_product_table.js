const { DataTypes } = require('sequelize');
const {
  getTableNameForMigrations,
  DB_TABLE_NAMES,
} = require('../constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.createTable(getTableNameForMigrations(DB_TABLE_NAMES.PRODUCT), {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        supplier_id: {
          type: DataTypes.INTEGER,
          references: {
            model: getTableNameForMigrations(DB_TABLE_NAMES.SUPPLIER),
            key: 'id',
          },
          onDelete: 'SET NULL',
        },
        category_id: {
          type: DataTypes.INTEGER,
          references: {
            model: getTableNameForMigrations(DB_TABLE_NAMES.CATEGORY),
            key: 'id',
          },
          onDelete: 'SET NULL',
        },
        name: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false,
        },
        slug: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
        },
        images_url: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          defaultValue: [],
        },
        unit_price: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        units_in_stock: {
          type: DataTypes.INTEGER,
          defaultValue: 100,
          allowNull: false,
        },
        units_on_order: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          allowNull: false,
        },
        units_sold: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        weight: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 25,
          validate: {
            max: 50000,
          },
        },
        length: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 10,
          validate: {
            max: 200,
          },
        },
        width: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 10,
          validate: {
            max: 200,
          },
        },
        height: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 10,
          validate: {
            max: 200,
          },
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
      await queryInterface.dropTable(getTableNameForMigrations(DB_TABLE_NAMES.PRODUCT), { transaction: t });
    });
  },
};
