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
  getAllCoupons,
  addCoupon,
  getCouponDetails,
  updateCoupon,
  deleteCoupon,
} = require('./couponController');
const {
  addCouponReq,
  addCouponRes,
  getAllCouponsRes,
  couponIdParam,
  getCouponDetailsRes,
  deleteCouponRes,
  updateCouponReq,
  updateCouponRes,
} = require('./couponSchema');


// GET /api/v1/coupons
router.get(
  '/',
  validateResponse(getAllCouponsRes),
  getAllCoupons,
);

// POST /api/v1/coupons
router.post(
  '/',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('write'),
  validateRequest(addCouponReq),
  validateResponse(addCouponRes),
  addCoupon,
);

// GET /api/v1/coupons/{couponId}
router.get(
  '/:couponId',
  validateParams(couponIdParam),
  validateResponse(getCouponDetailsRes),
  getCouponDetails,
);

// PUT /api/v1/coupons/{couponId}
router.put(
  '/:couponId',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('update'),
  validateParams(couponIdParam),
  validateRequest(updateCouponReq),
  validateResponse(updateCouponRes),
  updateCoupon,
);

// DELETE /api/v1/coupons/{couponId}
router.delete(
  '/:couponId',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('delete'),
  validateParams(couponIdParam),
  validateResponse(deleteCouponRes),
  deleteCoupon,
);

module.exports = router;
