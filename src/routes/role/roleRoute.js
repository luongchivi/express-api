const express = require('express');
const router = express.Router();
const {
  createRole,
  getRoleDetails,
  deleteRole,
  getAllRoles,
  assignPermission,
  deletePermissionAssign
} = require('../role/roleController');
const {
  validateRequest,
  validateResponse,
  validateParams
} = require('../../middleware/validationHandler');
const {
  createRoleReq,
  createRoleRes,
  roleIdParam,
  getRoleDetailsRes,
  deleteRoleRes,
  getAllRolesRes,
  assignPermissionReq,
  assignPermissionRes,
  deletePermissionAssignReq,
  deletePermissionAssignRes
} = require('../role/roleSchema');
const {
  verifyPermission,
  verifyRole
} = require('../../middleware/authHandler');


// GET /api/v1/roles
router.get(
  '/',
  verifyRole(['Admin']),
  verifyPermission('read'),
  validateResponse(getAllRolesRes),
  getAllRoles
);

// POST /api/v1/roles
router.post(
  '/',
  verifyRole(['Admin']),
  verifyPermission('write'),
  validateRequest(createRoleReq),
  validateResponse(createRoleRes),
  createRole
);

// GET /api/v1/roles/{roleId}
router.get(
  '/:roleId',
  verifyRole(['Admin']),
  verifyPermission('read'),
  validateParams(roleIdParam),
  validateResponse(getRoleDetailsRes),
  getRoleDetails
);

// DELETE /api/v1/roles/{roleId}
router.delete(
  '/:roleId',
  verifyRole(['Admin']),
  verifyPermission('delete'),
  validateParams(roleIdParam),
  validateResponse(deleteRoleRes),
  deleteRole
);

// POST /api/v1/roles/{roleId}/permissions
router.post(
  '/:roleId/permissions',
  verifyRole(['Admin']),
  verifyPermission('write'),
  validateParams(roleIdParam),
  validateRequest(assignPermissionReq),
  validateResponse(assignPermissionRes),
  assignPermission
);

// DELETE /api/v1/roles/{roleId}/permissions
router.delete(
  '/:roleId/permissions',
  verifyRole(['Admin']),
  verifyPermission('write'),
  validateParams(roleIdParam),
  validateRequest(deletePermissionAssignReq),
  validateResponse(deletePermissionAssignRes),
  deletePermissionAssign
);

module.exports = router;
