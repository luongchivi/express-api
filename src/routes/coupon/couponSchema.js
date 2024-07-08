const Joi = require('joi');
const {
  createResultsSchemaResponse,
  createListResultsSchemaResponse,
  createMessageSchemaResponse
} = require('../shared');

const addCouponReq = Joi.object({
  name: Joi.string().required(),
  discount: Joi.number().required(),
  expiry: Joi.date().iso().required(),
});

const addCouponRes = createResultsSchemaResponse({
  coupon: Joi.object().required()
});

const getAllCouponsRes = createListResultsSchemaResponse({
  coupons: Joi.array()
});

const couponIdParam = Joi.object({
  couponId: Joi.number().required(),
});

const getCouponDetailsRes = createResultsSchemaResponse({
  coupon: Joi.object().required()
});

const deleteCouponRes = createMessageSchemaResponse();

const updateCouponReq = Joi.object({
  name: Joi.string().optional(),
  discount: Joi.number().optional(),
  expiry: Joi.date().iso().optional(),
});

const updateCouponRes = createResultsSchemaResponse({
  coupon: Joi.object().required()
});

module.exports = {
  addCouponReq,
  addCouponRes,
  getAllCouponsRes,
  couponIdParam,
  getCouponDetailsRes,
  deleteCouponRes,
  updateCouponReq,
  updateCouponRes
}
