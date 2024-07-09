const { DataTypes } = require('sequelize');
const {
  getTableNameForMigrations,
  DB_TABLE_NAMES,
} = require('../constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.createTable(getTableNameForMigrations(DB_TABLE_NAMES.USER_ROLE), {
        user_id: {
          type: DataTypes.INTEGER,
          references: {
            model: getTableNameForMigrations(DB_TABLE_NAMES.USER),
            key: 'id',
          },
          allowNull: false,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        role_id: {
          type: DataTypes.INTEGER,
          references: {
            model: getTableNameForMigrations(DB_TABLE_NAMES.ROLE),
            key: 'id',
          },
          allowNull: false,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
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

      // thêm ràng buộc vào user_id và role_id
      await queryInterface.addConstraint(getTableNameForMigrations(DB_TABLE_NAMES.USER_ROLE), {
        type: 'unique',
        name: 'user_role_unique_constraint',
        fields: ['user_id', 'role_id'],
        transaction: t,
      });
    });
  },

  async down(queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction(async t => {
      // xóa ràng buộc trước khi xóa table
      await queryInterface.removeConstraint(getTableNameForMigrations(DB_TABLE_NAMES.USER_ROLE), 'user_role_unique_constraint', { transaction: t });

      await queryInterface.dropTable(getTableNameForMigrations(DB_TABLE_NAMES.USER_ROLE), { transaction: t });
    });
  },
};
