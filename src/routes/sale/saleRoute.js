const express = require('express');


const router = express.Router();
const {
  verifyPermission,
  verifyRole,
  verifyToken,
} = require('../../middleware/authHandler');
const {
  validateResponse,
} = require('../../middleware/validationHandler');
const {
  getSalesMonthly,
} = require('./saleController');
const {
  getAllOrderOfUserRes,
} = require('./saleSchema');


// GET /api/v1/sales/monthly
router.get(
  '/monthly',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('read'),
  validateResponse(getAllOrderOfUserRes),
  getSalesMonthly,
);


module.exports = router;
