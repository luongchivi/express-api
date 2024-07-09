const { DB_TABLE_NAMES, getTableNameForMigrations } = require('../constants');


const roles = [
  {
    id: 1,
    name: 'Admin',
    description: 'Administrator role has all permissions and manage all roles.',
  },
  {
    id: 2,
    name: 'User',
    description: 'User role',
  },
];

const permissions = [
  {
    id: 1,
    name: 'read',
    description: 'permission to read the resource',
  },
  {
    id: 2,
    name: 'write',
    description: 'permission to write the resource',
  },
  {
    id: 3,
    name: 'update',
    description: 'permission to update the resource',
  },
  {
    id: 4,
    name: 'delete',
    description: 'permission to delete the resource',
  },
];

const permissionsOfUserAndAdmin = [
  {
    role_id: 2, // 'User'
    permission_id: 1, // 'read'
  },
  {
    role_id: 2, // 'User'
    permission_id: 2, // 'write'
  },
  {
    role_id: 2, // 'User'
    permission_id: 3, // 'update'
  },
  {
    role_id: 1, // 'Admin'
    permission_id: 1, // 'read'
  },
  {
    role_id: 1, // 'Admin'
    permission_id: 2, // 'write'
  },
  {
    role_id: 1, // 'Admin'
    permission_id: 3, // 'update'
  },
  {
    role_id: 1, // 'Admin'
    permission_id: 4, // 'delete'
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction(async t => {
      const dataRoles = roles.map(i => ({
        ...i,
        created_at: new Date(),
        updated_at: new Date(),
      }));

      const dataPermissions = permissions.map(i => ({
        ...i,
        created_at: new Date(),
        updated_at: new Date(),
      }));

      const permissionsOfUserAndAdminData = permissionsOfUserAndAdmin.map(i => ({
        ...i,
        created_at: new Date(),
        updated_at: new Date(),
      }));
      await queryInterface.bulkInsert(getTableNameForMigrations(DB_TABLE_NAMES.ROLE), dataRoles, { transaction: t });
      await queryInterface.bulkInsert(getTableNameForMigrations(DB_TABLE_NAMES.PERMISSION), dataPermissions, { transaction: t });
      await queryInterface.bulkInsert(getTableNameForMigrations(DB_TABLE_NAMES.ROLE_PERMISSION), permissionsOfUserAndAdminData, { transaction: t });
    });
  },

  async down(queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.bulkDelete(getTableNameForMigrations(DB_TABLE_NAMES.ROLE), null, { transaction: t });
      await queryInterface.bulkDelete(getTableNameForMigrations(DB_TABLE_NAMES.PERMISSION), null, { transaction: t });
      await queryInterface.bulkDelete(getTableNameForMigrations(DB_TABLE_NAMES.ROLE_PERMISSION), null, { transaction: t });
    });
  },
};
