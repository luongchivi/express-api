'use strict';

const { getTableNameForMigrations,
  DB_TABLE_NAMES
} = require('../constants');
const { DataTypes } = require('sequelize');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(getTableNameForMigrations(DB_TABLE_NAMES.ROLE_PERMISSION), {
        role_id: {
          type: DataTypes.INTEGER,
          references: {
            model: getTableNameForMigrations(DB_TABLE_NAMES.ROLE),
            key: 'id'
          },
          allowNull: false,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        permission_id: {
          type: DataTypes.INTEGER,
          references: {
            model: getTableNameForMigrations(DB_TABLE_NAMES.PERMISSION),
            key: 'id'
          },
          allowNull: false,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false
        }
      }, { transaction: t });

      await queryInterface.addConstraint(getTableNameForMigrations(DB_TABLE_NAMES.ROLE_PERMISSION), {
        type: 'unique',
        name: 'role_permission_unique_constraint',
        fields: ['role_id', 'permission_id'],
        transaction: t
      });
    })
  },

  async down (queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeConstraint(getTableNameForMigrations(DB_TABLE_NAMES.ROLE_PERMISSION), 'role_permission_unique_constraint', { transaction: t });

      await queryInterface.dropTable(getTableNameForMigrations(DB_TABLE_NAMES.ROLE_PERMISSION), { transaction: t });
    })
  }
};
