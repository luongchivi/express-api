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

const productIdParam = Joi.object({
  productId: Joi.number().integer().required(),
});

const updateQuantityProductInCartReq = Joi.object({
  quantity: Joi.number().integer().min(1).required(),
});

const updateQuantityProductInCartRes = createResultsSchemaResponse({
  cart: Joi.object().required(),
});

const deleteProductInCartRes = createResultsSchemaResponse({
  cart: Joi.object().required(),
});

const getCurrentCartRes = createResultsSchemaResponse({
  cart: Joi.object().required(),
})

module.exports = {
  addToCartReq,
  addToCartRes,
  productIdParam,
  updateQuantityProductInCartReq,
  updateQuantityProductInCartRes,
  deleteProductInCartRes,
  getCurrentCartRes,
};
