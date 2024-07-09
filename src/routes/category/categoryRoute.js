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
} = require('../../middleware/validationHandler');
const {
  addCategory,
  getAllCategories,
  getCategoryDetails,
  deleteCategory,
  updateCategory,
} = require('./categoryController');
const {
  addCategoryReq,
  addCategoryRes,
  getAllCategoriesRes,
  categoryIdParam,
  getCategoryDetailsRes,
  deleteCategoryRes,
  updateCategoryReq,
  updateCategoryRes,
} = require('./categorySchema');


// GET /api/v1/categories
router.get(
  '/',
  verifyRole(['Admin']),
  verifyPermission('read'),
  validateResponse(getAllCategoriesRes),
  getAllCategories,
);

// POST /api/v1/categories
router.post(
  '/',
  verifyRole(['Admin']),
  verifyPermission('write'),
  validateRequest(addCategoryReq),
  validateResponse(addCategoryRes),
  addCategory,
);

// GET /api/v1/categories/{categoryId}
router.get(
  '/:categoryId',
  verifyRole(['Admin']),
  verifyPermission('read'),
  validateParams(categoryIdParam),
  validateResponse(getCategoryDetailsRes),
  getCategoryDetails,
);

// PUT /api/v1/categories/{categoryId}
router.put(
  '/:categoryId',
  verifyRole(['Admin']),
  verifyPermission('update'),
  validateParams(categoryIdParam),
  validateRequest(updateCategoryReq),
  validateResponse(updateCategoryRes),
  updateCategory,
);

// DELETE /api/v1/categories/{categoryId}
router.delete(
  '/:categoryId',
  verifyRole(['Admin']),
  verifyPermission('delete'),
  validateParams(categoryIdParam),
  validateResponse(deleteCategoryRes),
  deleteCategory,
);

module.exports = router;
