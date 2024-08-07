const Joi = require('joi');
const {
  createMessageSchemaResponse,
  createListResultsSchemaResponse,
  createSchemaQuery,
  createResultsSchemaResponse,
} = require('../shared');


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

const getAllOrderOfUserRes = createListResultsSchemaResponse({
  orders: Joi.array().required(),
});

const getAllOrderOfUserQuery = createSchemaQuery({
  orderStatus: Joi.string().valid(...Object.values(orderStatus)).optional(),
  paymentType: Joi.string().valid(...Object.values(paymentType)).optional(),
  totalAmount: Joi.number().optional(),
  createdAt: Joi.string().optional(),
});

const orderIdParam = Joi.object({
  orderId: Joi.number().optional(),
});

const cancelOrderRes = createMessageSchemaResponse();

const getOrderShippingDetailsRes = createResultsSchemaResponse({
  shippingOrder: Joi.object().required(),
});

module.exports = {
  paymentType,
  orderStatus,
  checkoutOrderReq,
  checkoutOrderRes,
  getAllOrderOfUserRes,
  getAllOrderOfUserQuery,
  orderIdParam,
  cancelOrderRes,
  getOrderShippingDetailsRes,
};
