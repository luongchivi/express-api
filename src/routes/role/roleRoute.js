const express = require('express');


const router = express.Router();
const {
  createRole,
  getRoleDetails,
  deleteRole,
  getAllRoles,
  assignPermission,
  deletePermissionAssign,
} = require('./roleController');
const {
  validateRequest,
  validateResponse,
  validateParams,
  validateQuery,
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
  deletePermissionAssignRes,
  getAllRolesQuery,
} = require('./roleSchema');
const {
  verifyPermission,
  verifyRole,
  verifyToken,
} = require('../../middleware/authHandler');


// GET /api/v1/roles
router.get(
  '/',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('read'),
  validateQuery(getAllRolesQuery),
  validateResponse(getAllRolesRes),
  getAllRoles,
);

// POST /api/v1/roles
router.post(
  '/',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('write'),
  validateRequest(createRoleReq),
  validateResponse(createRoleRes),
  createRole,
);

// GET /api/v1/roles/{roleId}
router.get(
  '/:roleId',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('read'),
  validateParams(roleIdParam),
  validateResponse(getRoleDetailsRes),
  getRoleDetails,
);

// DELETE /api/v1/roles/{roleId}
router.delete(
  '/:roleId',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('delete'),
  validateParams(roleIdParam),
  validateResponse(deleteRoleRes),
  deleteRole,
);

// POST /api/v1/roles/{roleId}/permissions
router.post(
  '/:roleId/permissions',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('write'),
  validateParams(roleIdParam),
  validateRequest(assignPermissionReq),
  validateResponse(assignPermissionRes),
  assignPermission,
);

// DELETE /api/v1/roles/{roleId}/permissions
router.delete(
  '/:roleId/permissions',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('write'),
  validateParams(roleIdParam),
  validateRequest(deletePermissionAssignReq),
  validateResponse(deletePermissionAssignRes),
  deletePermissionAssign,
);

module.exports = router;
