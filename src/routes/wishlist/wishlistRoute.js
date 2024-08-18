const express = require('express');


const router = express.Router();
const {
  validateResponse,
  validateRequest,
} = require('../../middleware/validationHandler');
const {
  addWishlist,
  deleteProductFromWishlist,
  getAllWishlistOfUser,
  wishlistStatistics,
} = require('./wishlistController');
const {
  addWishlistReq,
  addWishlistRes,
  deleteProductFromWishlistReq,
  deleteProductFromWishlistRes,
  getAllWishlistOfUserRes,
  wishlistStatisticsRes,
} = require('./wishlistSchema');
const {
  verifyToken,
  verifyRole,
  verifyPermission,
} = require('../../middleware/authHandler');


// POST /api/v1/wishlists
router.post(
  '/',
  verifyToken,
  verifyRole(['User', 'Admin']),
  verifyPermission('write'),
  validateRequest(addWishlistReq),
  validateResponse(addWishlistRes),
  addWishlist,
);

// DELETE /api/v1/wishlists
router.delete(
  '/',
  verifyToken,
  verifyRole(['User', 'Admin']),
  verifyPermission('delete'),
  validateRequest(deleteProductFromWishlistReq),
  validateResponse(deleteProductFromWishlistRes),
  deleteProductFromWishlist,
);

// GET /api/v1/wishlists/user
router.get(
  '/user',
  verifyToken,
  verifyRole(['User', 'Admin']),
  verifyPermission('read'),
  validateResponse(getAllWishlistOfUserRes),
  getAllWishlistOfUser,
);

// GET /api/v1/wishlists/wishlist-statistics
router.get(
  '/wishlist-statistics',
  verifyToken,
  verifyRole(['User', 'Admin']),
  verifyPermission('read'),
  validateResponse(wishlistStatisticsRes),
  wishlistStatistics,
);


module.exports = router;
