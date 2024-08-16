const express = require('express');


const router = express.Router();
const {
  verifyPermission,
  verifyRole,
  verifyToken,
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
  getShippingFeeOrder,
  getOrderDetailUser,
  updateStatusOrderUser,
  getAllOrders,
  updateStatusOrder,
} = require('./orderController');
const {
  checkoutOrderReq,
  checkoutOrderRes,
  getAllOrderOfUserRes,
  getAllOrderOfUserQuery,
  orderIdParam,
  cancelOrderRes,
  getOrderShippingDetailsRes,
  getOrderDetailUserRes,
  updateStatusOrderUserRes,
  getAllOrdersRes,
  getAllOrdersQuery,
  updateStatusOrderReq,
  updateStatusOrderRes,
} = require('./orderSchema');


// GET /api/v1/orders/user
router.get(
  '/user',
  verifyToken,
  verifyRole(['Admin', 'User']),
  verifyPermission('read'),
  validateQuery(getAllOrderOfUserQuery),
  validateResponse(getAllOrderOfUserRes),
  getAllOrderOfUser,
);

// POST /api/v1/orders/check-out
router.post(
  '/check-out',
  verifyToken,
  verifyRole(['Admin', 'User']),
  verifyPermission('write'),
  validateRequest(checkoutOrderReq),
  validateResponse(checkoutOrderRes),
  checkoutOrder,
);

// POST /api/v1/orders/{orderId}/cancel-order
router.post(
  '/:orderId/cancel-order',
  verifyToken,
  verifyRole(['Admin', 'User']),
  verifyPermission('write'),
  validateParams(orderIdParam),
  validateResponse(cancelOrderRes),
  cancelOrder,
);

// POST /api/v1/orders/{orderId}/shipping-order
router.post(
  '/:orderId/shipping-order',
  verifyToken,
  verifyRole(['Admin', 'User']),
  verifyPermission('write'),
  validateParams(orderIdParam),
  validateResponse(getOrderShippingDetailsRes),
  getOrderShippingDetails,
);

// GET /api/v1/orders/calculate-shipping-fee
router.get(
  '/calculate-shipping-fee',
  verifyToken,
  verifyRole(['Admin', 'User']),
  verifyPermission('read'),
  getShippingFeeOrder,
);

// GET /api/v1/orders/{orderId}/user
router.get(
  '/:orderId/user',
  verifyToken,
  verifyRole(['Admin', 'User']),
  verifyPermission('read'),
  validateParams(orderIdParam),
  validateResponse(getOrderDetailUserRes),
  getOrderDetailUser,
);

// PUT /api/v1/orders/{orderId}/user
router.put(
  '/:orderId/user',
  verifyToken,
  verifyRole(['Admin', 'User']),
  verifyPermission('update'),
  validateParams(orderIdParam),
  validateResponse(updateStatusOrderUserRes),
  updateStatusOrderUser,
);

// GET /api/v1/orders
router.get(
  '/',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('read'),
  validateQuery(getAllOrdersQuery),
  validateResponse(getAllOrdersRes),
  getAllOrders,
);

// PUT /api/v1/orders/{orderId}
router.put(
  '/:orderId',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('update'),
  validateParams(orderIdParam),
  validateRequest(updateStatusOrderReq),
  validateResponse(updateStatusOrderRes),
  updateStatusOrder,
);

module.exports = router;
