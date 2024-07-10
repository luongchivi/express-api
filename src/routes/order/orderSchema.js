const Joi = require('joi');
const { createMessageSchemaResponse } = require('../shared');


const paymentType = Object.freeze({
  PAYPAL: 'PayPal',
  BANK_TRANSFER: 'Bank Transfer',
  CASH_ON_DELIVERY: 'Cash on Delivery',
});

const orderStatus = Object.freeze({
  CANCELLED: 'Cancelled',
  PROCESSING: 'Processing',
  SUCCEEDED: 'Succeeded',
});

const checkoutOrderReq = Joi.object({
  paymentType: Joi.string().valid(...Object.values(paymentType)).required(),
  // couponCodes: Joi.array().items(Joi.string()).optional(),
});

const checkoutOrderRes = createMessageSchemaResponse();

module.exports = {
  paymentType,
  orderStatus,
  checkoutOrderReq,
  checkoutOrderRes,
};
