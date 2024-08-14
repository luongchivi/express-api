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
} = require('../../middleware/validationHandler');
const {
  saveTransactionPaypal,
} = require('./transactionController');
const {
  saveTransactionPaypalReq,
  saveTransactionPaypalRes,
} = require('./transactionSchema');


// POST /api/v1/transactions/paypal
router.post(
  '/paypal',
  verifyToken,
  verifyRole(['Admin', 'User']),
  verifyPermission('write'),
  validateRequest(saveTransactionPaypalReq),
  validateResponse(saveTransactionPaypalRes),
  saveTransactionPaypal,
);


module.exports = router;
