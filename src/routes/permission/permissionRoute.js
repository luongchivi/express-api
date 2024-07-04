const express = require('express');
const router = express.Router();
const {
  addPermission,
  getAllPermissions,
  getPermissionDetails,
  deletePermission
} = require('../permission/permissionController');
const {
  validateRequest,
  validateResponse,
  validateParams
} = require('../../middleware/validationHandler');
const {
  addPermissionReq,
  addPermissionRes,
  getAllPermissionsRes,
  permissionIdParam,
  getPermissionDetailsRes,
  deletePermissionRes
} = require('../permission/permissionSchema');
const {
  verifyPermission,
  verifyRole
} = require('../../middleware/authHandler');


// GET /api/v1/permissions
router.get(
  '/',
  verifyRole(['Admin']),
  verifyPermission('read'),
  validateResponse(getAllPermissionsRes),
  getAllPermissions
);

// POST /api/v1/permissions
router.post(
  '/',
  verifyRole(['Admin']),
  verifyPermission('write'),
  validateRequest(addPermissionReq),
  validateResponse(addPermissionRes),
  addPermission
);

// GET /api/v1/permissions/{permissionId}
router.get(
  '/:permissionId',
  verifyRole(['Admin']),
  verifyPermission('read'),
  validateParams(permissionIdParam),
  validateResponse(getPermissionDetailsRes),
  getPermissionDetails
);

// DELETE /api/v1/permissions/{permissionId}
router.delete(
  '/:permissionId',
  verifyRole(['Admin']),
  verifyPermission('delete'),
  validateParams(permissionIdParam),
  validateResponse(deletePermissionRes),
  deletePermission
);

module.exports = router;
