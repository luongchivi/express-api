const express = require('express');


const router = express.Router();
const {
  addAddress,
  getAddress,
  updateAddress,
  deleteAddress,
} = require('./addressController');
const {
  validateRequest,
  validateResponse,
  validateParams,
} = require('../../middleware/validationHandler');
const {
  addAddressReq,
  addAddressRes,
  addressIdParam,
  getAddressRes,
  updateAddressReq,
  updateAddressRes,
  deleteAddressRes,
} = require('./addressSchema');
const {
  verifyPermission,
  verifyRole,
  verifyToken,
} = require('../../middleware/authHandler');


// POST /api/v1/address
router.post(
  '/',
  verifyToken,
  verifyRole(['Admin', 'User']),
  verifyPermission('write'),
  validateRequest(addAddressReq),
  validateResponse(addAddressRes),
  addAddress,
);

// GET /api/v1/address/{addressId}
router.get(
  '/:addressId',
  verifyToken,
  verifyRole(['Admin', 'User']),
  verifyPermission('read'),
  validateParams(addressIdParam),
  validateResponse(getAddressRes),
  getAddress,
);

// PUT /api/v1/address/{addressId}
router.put(
  '/:addressId',
  verifyToken,
  verifyRole(['Admin', 'User']),
  verifyPermission('update'),
  validateParams(addressIdParam),
  validateRequest(updateAddressReq),
  validateResponse(updateAddressRes),
  updateAddress,
);

// DELETE /api/v1/address/{addressId}
router.delete(
  '/:addressId',
  verifyToken,
  verifyRole(['Admin', 'User']),
  verifyPermission('delete'),
  validateParams(addressIdParam),
  validateResponse(deleteAddressRes),
  deleteAddress,
);

module.exports = router;
