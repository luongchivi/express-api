const express = require('express');


const router = express.Router();
const {
  verifyPermission,
  verifyRole,
} = require('../../middleware/authHandler');
const {
  validateResponse,
  validateRequest,
  validateQuery,
} = require('../../middleware/validationHandler');
const {
  getAllOrderOfUser,
  checkoutOrder,
} = require('./orderController');
const {
  checkoutOrderReq,
  checkoutOrderRes,
  getAllOrderOfUserRes,
  getAllOrderOfUserQuery,
} = require('./orderSchema');


// GET /api/v1/orders/user
router.get(
  '/user',
  verifyRole(['Admin', 'User']),
  verifyPermission('read'),
  validateQuery(getAllOrderOfUserQuery),
  validateResponse(getAllOrderOfUserRes),
  getAllOrderOfUser,
);

// POST /api/v1/orders/check-out
router.post(
  '/check-out',
  verifyRole(['Admin', 'User']),
  verifyPermission('write'),
  validateRequest(checkoutOrderReq),
  validateResponse(checkoutOrderRes),
  checkoutOrder,
);

module.exports = router;
