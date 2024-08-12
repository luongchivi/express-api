const express = require('express');


const router = express.Router();
const {
  getAllUsers,
  getUserDetails,
  getCurrentUser,
  updateUser,
  softDelete,
  assignRole,
  deleteRoleAssign,
} = require('./userController');
const {
  validateParams,
  validateResponse,
  validateRequest,
  validateQuery,
} = require('../../middleware/validationHandler');
const {
  getAllUsersRes,
  getUserDetailsRes,
  idParam,
  updateUserReq,
  updateUserRes,
  assignRoleReq,
  assignRoleRes,
  softDeleteUserRes,
  deleteRoleAssignReq,
  deleteRoleAssignRes,
  getAllUsersQuery,
  getCurrentUserRes,
} = require('./userSchema');
const {
  verifyPermission,
  verifyRole,
  verifyToken,
} = require('../../middleware/authHandler');


// GET /api/v1/users
router.get(
  '/',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('read'),
  validateQuery(getAllUsersQuery),
  validateResponse(getAllUsersRes),
  getAllUsers,
);

// GET /api/v1/users/current-user
router.get(
  '/current-user',
  verifyToken,
  verifyRole(['User']),
  verifyPermission('read'),
  validateResponse(getCurrentUserRes),
  getCurrentUser,
);

// GET /api/v1/users/{id}
router.get(
  '/:id',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('read'),
  validateParams(idParam),
  validateResponse(getUserDetailsRes),
  getUserDetails,
);

// PUT /api/v1/users/{id}
router.put(
  '/:id',
  verifyToken,
  verifyRole(['Admin', 'User']),
  verifyPermission('update'),
  validateParams(idParam),
  validateRequest(updateUserReq),
  validateResponse(updateUserRes),
  updateUser,
);

// DELETE /api/v1/users/{id}
router.delete(
  '/:id',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('delete'),
  validateParams(idParam),
  validateResponse(softDeleteUserRes),
  softDelete,
);

// POST /api/v1/users/{id}/roles
router.post(
  '/:id/roles',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('write'),
  validateParams(idParam),
  validateRequest(assignRoleReq),
  validateResponse(assignRoleRes),
  assignRole,
);

// DELETE /api/v1/users/{id}/roles
router.delete(
  '/:id/roles',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('delete'),
  validateParams(idParam),
  validateRequest(deleteRoleAssignReq),
  validateResponse(deleteRoleAssignRes),
  deleteRoleAssign,
);

module.exports = router;
