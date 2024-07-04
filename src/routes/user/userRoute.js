const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserDetails,
  updateUser,
  softDelete,
  assignRole,
  deleteRoleAssign
} = require('./userController');
const {
  validateParams,
  validateResponse,
  validateRequest,
  validateQuery
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
  getAllUsersQuery
} = require('./userSchema');
const {
  verifyPermission,
  verifyRole
} = require('../../middleware/authHandler');


// GET /api/v1/users
router.get(
  '/',
  verifyRole(['Admin']),
  verifyPermission('read'),
  validateQuery(getAllUsersQuery),
  validateResponse(getAllUsersRes),
  getAllUsers
);

// GET /api/v1/users/{id}
router.get(
  '/:id',
  verifyRole(['Admin', 'User']),
  verifyPermission('read'),
  validateParams(idParam),
  validateResponse(getUserDetailsRes),
  getUserDetails
);

// PATCH /api/v1/users/{id}
router.patch(
  '/:id',
  verifyRole(['Admin', 'User']),
  verifyPermission('update'),
  validateParams(idParam),
  validateRequest(updateUserReq),
  validateResponse(updateUserRes),
  updateUser
);

// DELETE /api/v1/users/{id}
router.delete(
  '/:id',
  verifyRole(['Admin']),
  verifyPermission('delete'),
  validateParams(idParam),
  validateResponse(softDeleteUserRes),
  softDelete
);

// POST /api/v1/users/{id}/roles
router.post(
  '/:id/roles',
  verifyRole(['Admin']),
  verifyPermission('write'),
  validateParams(idParam),
  validateRequest(assignRoleReq),
  validateResponse(assignRoleRes),
  assignRole
);

// DELETE /api/v1/users/{id}/roles
router.delete(
  '/:id/roles',
  verifyRole(['Admin']),
  verifyPermission('delete'),
  validateParams(idParam),
  validateRequest(deleteRoleAssignReq),
  validateResponse(deleteRoleAssignRes),
  deleteRoleAssign
);

module.exports = router;
