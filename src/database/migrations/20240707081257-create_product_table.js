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
        },
        category_id: {
          type: DataTypes.INTEGER,
          references: {
            model: getTableNameForMigrations(DB_TABLE_NAMES.CATEGORY),
            key: 'id',
          },
        },
        name: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false,
          trim: true,
        },
        slug: {
          type: DataTypes.STRING,
          unique: true,
          lowercase: true,
          required: true,
        },
        description: {
          type: DataTypes.STRING,
        },
        image_url: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          defaultValue: [],
        },
        unit_price: {
          type: DataTypes.FLOAT,
          required: true,
        },
        units_in_stock: {
          type: DataTypes.INTEGER,
        },
        units_on_order: {
          type: DataTypes.INTEGER,
        },
        units_sold: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        discount: {
          type: DataTypes.FLOAT,
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
