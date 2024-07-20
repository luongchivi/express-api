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
  validateParams,
} = require('../../middleware/validationHandler');
const {
  getAllOrderOfUser,
  checkoutOrder,
  cancelOrder,
  getOrderShippingDetails,
} = require('./orderController');
const {
  checkoutOrderReq,
  checkoutOrderRes,
  getAllOrderOfUserRes,
  getAllOrderOfUserQuery,
  orderIdParam,
  cancelOrderRes,
  getOrderShippingDetailsRes,
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

// POST /api/v1/orders/{orderId}/cancel-order
router.post(
  '/:orderId/cancel-order',
  verifyRole(['Admin', 'User']),
  verifyPermission('write'),
  validateParams(orderIdParam),
  validateResponse(cancelOrderRes),
  cancelOrder,
);

// POST /api/v1/orders/{orderId}/shipping-order
router.post(
  '/:orderId/shipping-order',
  verifyRole(['Admin', 'User']),
  verifyPermission('write'),
  validateParams(orderIdParam),
  validateResponse(getOrderShippingDetailsRes),
  getOrderShippingDetails,
);

module.exports = router;
