const express = require('express');


const router = express.Router();
const {
  verifyPermission,
  verifyRole,
} = require('../../middleware/authHandler');
const {
  validateResponse,
  validateRequest,
  validateParams,
  validateQuery,
} = require('../../middleware/validationHandler');
const {
  addCategory,
  getAllCategories,
  getCategoryDetails,
  deleteCategory,
  updateCategory,
  assignSupplier,
  deleteSupplierAssign,
} = require('./categoryController');
const {
  addCategoryReq,
  addCategoryRes,
  getAllCategoriesQuery,
  getAllCategoriesRes,
  categoryIdParam,
  getCategoryDetailsRes,
  deleteCategoryRes,
  updateCategoryReq,
  updateCategoryRes,
  assignSupplierReq,
  assignSupplierRes,
  deleteSupplierAssignReq,
  deleteSupplierAssignRes,
  formDataFieldsUploadConfig,
} = require('./categorySchema');
const { verifyToken } = require('../../middleware/authHandler');
const formDataFields = require('../../middleware/formDataHandler');

// GET /api/v1/categories
router.get(
  '/',
  validateQuery(getAllCategoriesQuery),
  validateResponse(getAllCategoriesRes),
  getAllCategories,
);

// POST /api/v1/categories
router.post(
  '/',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('write'),
  formDataFields(formDataFieldsUploadConfig),
  validateRequest(addCategoryReq),
  validateResponse(addCategoryRes),
  addCategory,
);

// GET /api/v1/categories/{categoryId}
router.get(
  '/:categoryId',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('read'),
  validateParams(categoryIdParam),
  validateResponse(getCategoryDetailsRes),
  getCategoryDetails,
);

// PUT /api/v1/categories/{categoryId}
router.put(
  '/:categoryId',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('update'),
  validateParams(categoryIdParam),
  formDataFields(formDataFieldsUploadConfig),
  validateRequest(updateCategoryReq),
  validateResponse(updateCategoryRes),
  updateCategory,
);

// DELETE /api/v1/categories/{categoryId}
router.delete(
  '/:categoryId',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('delete'),
  validateParams(categoryIdParam),
  validateResponse(deleteCategoryRes),
  deleteCategory,
);

// POST /api/v1/categories/{categoryId}/supplier
router.post(
  '/:categoryId/supplier',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('write'),
  validateParams(categoryIdParam),
  validateRequest(assignSupplierReq),
  validateResponse(assignSupplierRes),
  assignSupplier,
);

// DELETE /api/v1/categories/{categoryId}/supplier
router.delete(
  '/:categoryId/supplier',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('delete'),
  validateParams(categoryIdParam),
  validateRequest(deleteSupplierAssignReq),
  validateResponse(deleteSupplierAssignRes),
  deleteSupplierAssign,
);

module.exports = router;
