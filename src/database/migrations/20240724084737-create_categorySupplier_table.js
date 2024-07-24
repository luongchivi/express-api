const { DataTypes } = require('sequelize');
const {
  getTableNameForMigrations,
  DB_TABLE_NAMES,
} = require('../constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.createTable(getTableNameForMigrations(DB_TABLE_NAMES.CATEGORY_SUPPLIER), {
        category_id: {
          type: DataTypes.INTEGER,
          references: {
            model: getTableNameForMigrations(DB_TABLE_NAMES.CATEGORY),
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: false,
        },
        supplier_id: {
          type: DataTypes.INTEGER,
          references: {
            model: getTableNameForMigrations(DB_TABLE_NAMES.SUPPLIER),
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
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

      // thêm ràng buộc vào category_id và supplier_id
      await queryInterface.addConstraint(getTableNameForMigrations(DB_TABLE_NAMES.CATEGORY_SUPPLIER), {
        type: 'unique',
        name: 'category_supplier_unique_constraint',
        fields: ['category_id', 'supplier_id'],
        transaction: t,
      });
    });
  },

  async down(queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.removeConstraint(getTableNameForMigrations(DB_TABLE_NAMES.CATEGORY_SUPPLIER), 'category_supplier_unique_constraint', { transaction: t });

      await queryInterface.dropTable(getTableNameForMigrations(DB_TABLE_NAMES.CATEGORY_SUPPLIER), { transaction: t });
    });
  },
};
