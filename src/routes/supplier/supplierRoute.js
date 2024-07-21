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
  validateParams,
} = require('../../middleware/validationHandler');
const {
  addSupplier,
  getAllSuppliers,
  getSupplierDetails,
  deleteSupplier,
  updateSupplier,
} = require('./supplierController');
const {
  getAllSuppliersRes,
  addSupplierReq,
  addSupplierRes,
  supplierIdParam,
  getSupplierDetailsRes,
  deleteSupplierRes,
  updateSupplierReq,
  updateSupplierRes,
} = require('./supplierSchema');


// GET /api/v1/suppliers
router.get(
  '/',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('read'),
  validateResponse(getAllSuppliersRes),
  getAllSuppliers,
);

// POST /api/v1/suppliers
router.post(
  '/',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('write'),
  validateRequest(addSupplierReq),
  validateResponse(addSupplierRes),
  addSupplier,
);

// GET /api/v1/suppliers/{supplierId}
router.get(
  '/:supplierId',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('read'),
  validateParams(supplierIdParam),
  validateResponse(getSupplierDetailsRes),
  getSupplierDetails,
);

// DELETE /api/v1/suppliers/{supplierId}
router.delete(
  '/:supplierId',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('delete'),
  validateParams(supplierIdParam),
  validateResponse(deleteSupplierRes),
  deleteSupplier,
);

// PUT /api/v1/suppliers/{supplierId}
router.put(
  '/:supplierId',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('delete'),
  validateParams(supplierIdParam),
  validateRequest(updateSupplierReq),
  validateResponse(updateSupplierRes),
  updateSupplier,
);

module.exports = router;
