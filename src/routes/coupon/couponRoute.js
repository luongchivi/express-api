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
  verifyRole(['Admin']),
  verifyPermission('read'),
  validateResponse(getAllCouponsRes),
  getAllCoupons,
);

// POST /api/v1/coupons
router.post(
  '/',
  verifyRole(['Admin']),
  verifyPermission('write'),
  validateRequest(addCouponReq),
  validateResponse(addCouponRes),
  addCoupon,
);

// GET /api/v1/coupons/{couponId}
router.get(
  '/:couponId',
  verifyRole(['Admin']),
  verifyPermission('read'),
  validateParams(couponIdParam),
  validateResponse(getCouponDetailsRes),
  getCouponDetails,
);

// PUT /api/v1/coupons/{couponId}
router.put(
  '/:couponId',
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
  verifyRole(['Admin']),
  verifyPermission('delete'),
  validateParams(couponIdParam),
  validateResponse(deleteCouponRes),
  deleteCoupon,
);

module.exports = router;
