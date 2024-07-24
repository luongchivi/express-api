const express = require('express');


const router = express.Router();
const {
  addPermission,
  getAllPermissions,
  getPermissionDetails,
  deletePermission,
} = require('./permissionController');
const {
  validateRequest,
  validateResponse,
  validateParams,
  validateQuery,
} = require('../../middleware/validationHandler');
const {
  addPermissionReq,
  addPermissionRes,
  getAllPermissionsRes,
  permissionIdParam,
  getPermissionDetailsRes,
  deletePermissionRes,
  getAllPermissionsQuery,
} = require('./permissionSchema');
const {
  verifyPermission,
  verifyRole,
  verifyToken,
} = require('../../middleware/authHandler');


// GET /api/v1/permissions
router.get(
  '/',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('read'),
  validateQuery(getAllPermissionsQuery),
  validateResponse(getAllPermissionsRes),
  getAllPermissions,
);

// POST /api/v1/permissions
router.post(
  '/',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('write'),
  validateRequest(addPermissionReq),
  validateResponse(addPermissionRes),
  addPermission,
);

// GET /api/v1/permissions/{permissionId}
router.get(
  '/:permissionId',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('read'),
  validateParams(permissionIdParam),
  validateResponse(getPermissionDetailsRes),
  getPermissionDetails,
);

// DELETE /api/v1/permissions/{permissionId}
router.delete(
  '/:permissionId',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('delete'),
  validateParams(permissionIdParam),
  validateResponse(deletePermissionRes),
  deletePermission,
);

module.exports = router;
