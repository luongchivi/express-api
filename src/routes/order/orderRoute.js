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
  getAllOrders,
  addOrder,
} = require('./orderController');
const {
  getAllOrdersRes,
  addOrderReq,
  addOrderRes,
} = require('./orderSchema');


// GET /api/v1/orders
router.get(
  '/',
  verifyRole(['Admin']),
  verifyPermission('read'),
  validateResponse(getAllOrdersRes),
  getAllOrders,
);

// POST /api/v1/orders
router.post(
  '/',
  verifyRole(['Admin', 'User']),
  verifyPermission('write'),
  validateRequest(addOrderReq),
  validateResponse(addOrderRes),
  addOrder,
);

module.exports = router;
