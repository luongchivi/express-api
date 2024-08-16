const { DataTypes } = require('sequelize');
const {
  getTableNameForMigrations,
  DB_TABLE_NAMES,
} = require('../constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.createTable(getTableNameForMigrations(DB_TABLE_NAMES.TRANSACTION_PAYPAL), {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        order_id: {
          type: DataTypes.INTEGER,
          references: {
            model: getTableNameForMigrations(DB_TABLE_NAMES.ORDER),
            key: 'id',
          },
          allowNull: false,
        },
        user_id: {
          type: DataTypes.INTEGER,
          references: {
            model: getTableNameForMigrations(DB_TABLE_NAMES.USER),
            key: 'id',
          },
          allowNull: false,
        },
        paypal_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        intent: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        currency_code: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        value: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        email_address: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        merchant_id: {
          type: DataTypes.STRING,
        },
        full_name: {
          type: DataTypes.STRING,
        },
        address_line_one: {
          type: DataTypes.STRING,
        },
        admin_area_two: {
          type: DataTypes.STRING,
        },
        admin_area_one: {
          type: DataTypes.STRING,
        },
        postal_code: {
          type: DataTypes.STRING,
        },
        country_code: {
          type: DataTypes.STRING,
        },
        payer_id: {
          type: DataTypes.STRING,
        },
        phone_number: {
          type: DataTypes.STRING,
        },
        raw_response: {
          type: DataTypes.JSON,
          allowNull: false,
          defaultValue: {},
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
      await queryInterface.dropTable(getTableNameForMigrations(DB_TABLE_NAMES.TRANSACTION_PAYPAL), { transaction: t });
    });
  },
};
