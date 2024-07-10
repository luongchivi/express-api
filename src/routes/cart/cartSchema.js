const Joi = require('joi');
const {
  createResultsSchemaResponse,
} = require('../shared');


const addToCartReq = Joi.object({
  productId: Joi.number().integer().required(),
  quantity: Joi.number().integer().min(1).required(),
});

const addToCartRes = createResultsSchemaResponse({
  cart: Joi.object().required(),
});

const updateQuantityProductInCartReq = Joi.object({
  productId: Joi.number().integer().required(),
  quantity: Joi.number().integer().min(1).required(),
});

const updateQuantityProductInCartRes = createResultsSchemaResponse({
  cart: Joi.object().required(),
});

module.exports = {
  addToCartReq,
  addToCartRes,
  updateQuantityProductInCartReq,
  updateQuantityProductInCartRes,
};
