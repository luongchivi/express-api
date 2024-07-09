const PermissionModel = require('../../database/models/permission');
const {
  buildSuccessResponse,
  buildResponseMessage,
} = require('../shared');


async function addPermission(req, res, next) {
  try {
    const payload = req.body;
    const permission = await PermissionModel.create(payload);
    return buildSuccessResponse(res, 'Add new permission successfully.', {
      permission,
    }, 201);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to add permission';
    next(error);
  }
}

async function getAllPermissions(req, res, next) {
  try {
    const permissions = await PermissionModel.findAll();
    return buildSuccessResponse(res, 'Get all permissions successfully.', {
      permissions,
    });
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to get all permissions';
    next(error);
  }
}

async function getPermissionDetails(req, res, next) {
  try {
    const { permissionId } = req.params;
    const permission = await PermissionModel.findByPk(permissionId);

    if (!permission) {
      return buildResponseMessage(res, 'Permission not found', 404);
    }

    return buildSuccessResponse(res, 'Get permission details successfully.', {
      permission,
    });
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to get permission details';
    next(error);
  }
}

async function deletePermission(req, res, next) {
  try {
    const { permissionId } = req.params;
    const permission = await PermissionModel.findByPk(permissionId);

    if (!permission) {
      return buildResponseMessage(res, 'Permission not found', 404);
    }
    await permission.destroy();
    return buildResponseMessage(res, 'Delete permission successfully.', 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to delete permission';
    next(error);
  }
}

module.exports = {
  addPermission,
  getAllPermissions,
  getPermissionDetails,
  deletePermission,
};
