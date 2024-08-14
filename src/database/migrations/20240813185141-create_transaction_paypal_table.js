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
          allowNull: false,
        },
        full_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        address_line_one: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        admin_area_two: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        admin_area_one: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        postal_code: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        country_code: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        payer_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        phone_number: {
          type: DataTypes.STRING,
          allowNull: false,
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
