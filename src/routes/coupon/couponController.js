const CouponModel = require('../../database/models/coupon');
const {
  buildSuccessResponse,
  buildResponseMessage
} = require('../shared');

async function addCoupon(req, res, next) {
  try {
    const payload = req.body;
    const newCoupon = await CouponModel.create(payload);
    return buildSuccessResponse(res, 'Add new coupon successfully.', {
      coupon: newCoupon,
    }, 201);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to add new coupon.';
    next(error);
  }
}

async function getAllCoupons(req, res, next) {
  try {
    const coupons = await CouponModel.findAll();
    return buildSuccessResponse(res, 'Get all coupons successfully.', {
      coupons: coupons || [],
    }, 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to get all coupons.';
    next(error);
  }
}

async function getCouponDetails(req, res, next) {
  try {
    const { couponId } = req.params;
    const coupon = await CouponModel.findByPk(couponId);
    if (!coupon) {
      return buildResponseMessage(res, 'Coupon not found.', 404);
    }
    return buildSuccessResponse(res, 'Get coupon details successfully.', {
      coupon,
    }, 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to get coupon details.';
    next(error);
  }
}

async function deleteCoupon(req, res, next) {
  try {
    const { couponId } = req.params;
    const coupon = await CouponModel.findByPk(couponId);
    if (!coupon) {
      return buildResponseMessage(res, 'Coupon not found.', 404);
    }
    await coupon.destroy();
    return buildResponseMessage(res, 'Delete coupon successfully.', 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to delete coupon.';
    next(error);
  }
}

async function updateCoupon(req, res, next) {
  try {
    const { couponId } = req.params;
    const payload = req.body;
    const coupon = await CouponModel.findByPk(couponId);
    if (!coupon) {
      return buildResponseMessage(res, 'Category not found.', 404);
    }
    await coupon.update(payload);
    return buildSuccessResponse(res, 'Update coupon successfully.', {
      coupon
    }, 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to coupon category.';
    next(error);
  }
}

module.exports = {
  getAllCoupons,
  addCoupon,
  getCouponDetails,
  updateCoupon,
  deleteCoupon
};
