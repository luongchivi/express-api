const RoleModel = require('../../database/models/role');
const RolePermissionModel = require('../../database/models/rolePermission');
const PermissionModel = require('../../database/models/permission');
const sequelize = require('../../../config/database');
const {
  buildResponseMessage,
  buildSuccessResponse,
} = require('../shared');
const UserRoleModel = require('../../database/models/userRole');


async function createRole(req, res, next) {
  const transaction = await sequelize.transaction();

  try {
    const newRole = await RoleModel.create(req.body, { transaction });

    await transaction.commit();

    return buildSuccessResponse(res, 'Role added successfully.', {
      role: newRole,
    }, 201);
  } catch (error) {
    await transaction.rollback();
    error.statusCode = 400;
    error.messageErrorAPI = 'Add role failed.';
    next(error);
  }
}

async function getRoleDetails(req, res, next) {
  try {
    const { roleId } = req.params;
    const role = await RoleModel.findByPk(roleId, {
      include: {
        model: PermissionModel,
        as: 'permissions',
        attributes: { exclude: [UserRoleModel] },
        through: { attributes: [] },
      },
    });
    if (!role) {
      return buildResponseMessage(res, 'Role not found.', 404);
    }
    return buildSuccessResponse(res, 'Get role successfully.', {
      role,
    }, 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Get role failed.';
    next(error);
  }
}

async function deleteRole(req, res, next) {
  try {
    const { roleId } = req.params;
    const role = await RoleModel.findByPk(roleId);
    if (!role) {
      return buildResponseMessage(res, 'Role not found.', 404);
    }
    await role.destroy();
    return buildResponseMessage(res, 'Delete role successfully.', 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Delete role failed.';
    next(error);
  }
}

async function getAllRoles(req, res, next) {
  try {
    const roles = await RoleModel.findAll();
    return buildSuccessResponse(res, 'Get all roles successfully.', {
      roles: roles || [],
    }, 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Get all roles failed.';
    next(error);
  }
}

async function assignPermission(req, res, next) {
  try {
    const { roleId } = req.params;
    const { permissionName } = req.body;

    const role = await RoleModel.findByPk(roleId);

    if (!role) {
      return buildResponseMessage(res, 'Role not found.', 404);
    }

    const permission = await PermissionModel.findOne({
      where: {
        name: permissionName,
      },
    });

    if (!permission) {
      return buildResponseMessage(res, 'Permission not found.', 404);
    }

    await RolePermissionModel.create({
      roleId: role.id,
      permissionId: permission.id,
    });

    return buildResponseMessage(res, 'Assign new permission to role successfully.', 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to assign role for role.';
    next(error);
  }
}

async function deletePermissionAssign(req, res, next) {
  try {
    const { roleId } = req.params;
    const { permissionName } = req.body;

    const role = await RoleModel.findByPk(roleId);

    if (!role) {
      return buildResponseMessage(res, 'Role not found.', 404);
    }

    const permission = await PermissionModel.findOne({
      where: {
        name: permissionName,
      },
    });

    if (!permission) {
      return buildResponseMessage(res, 'Permission not found.', 404);
    }

    await RolePermissionModel.destroy({
      where: {
        roleId: role.id,
        permissionId: permission.id,
      },
    });

    return buildResponseMessage(res, 'Delete permission assign to role successfully.', 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to delete permission assign to role.';
    next(error);
  }
}

module.exports = {
  createRole,
  getRoleDetails,
  deleteRole,
  getAllRoles,
  assignPermission,
  deletePermissionAssign,
};
