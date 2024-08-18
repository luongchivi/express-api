const Joi = require('joi');
const {
  createMessageSchemaResponse,
  createListResultsSchemaResponse,
} = require('../shared');


const addWishlistRes = createMessageSchemaResponse();

const addWishlistReq = Joi.object({
  productId: Joi.number().required(),
});

const deleteProductFromWishlistReq = Joi.object({
  productId: Joi.number().required(),
});

const deleteProductFromWishlistRes = createMessageSchemaResponse();

const getAllWishlistOfUserRes = createListResultsSchemaResponse({
  wishlists: Joi.array().required(),
});

const wishlistStatisticsRes = createListResultsSchemaResponse({});

module.exports = {
  addWishlistReq,
  addWishlistRes,
  deleteProductFromWishlistReq,
  deleteProductFromWishlistRes,
  getAllWishlistOfUserRes,
  wishlistStatisticsRes,
};
