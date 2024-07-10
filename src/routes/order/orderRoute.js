const express = require('express');


const router = express.Router();
const {
  verifyPermission,
  verifyRole,
} = require('../../middleware/authHandler');
const {
  validateResponse,
  validateRequest,
} = require('../../middleware/validationHandler');
const {
  // getAllOrders,
  checkoutOrder,
} = require('./orderController');
const {
  // getAllOrdersRes,
  checkoutOrderReq,
  checkoutOrderRes,
} = require('./orderSchema');


// GET /api/v1/orders
// router.get(
//   '/',
//   verifyRole(['Admin']),
//   verifyPermission('read'),
//   validateResponse(getAllOrdersRes),
//   getAllOrders,
// );

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
