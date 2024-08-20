const { Op } = require('sequelize');
const WishlistModel = require('../../database/models/wishlist');
const UserModel = require('../../database/models/user');
const ProductModel = require('../../database/models/product');
const CategoryModel = require('../../database/models/category');
const sequelize = require('../../../config/database');
const {
  buildResponseMessage,
  parseQueryParams,
  buildResultListResponse,
} = require('../shared');


async function addWishlist(req, res, next) {
  try {
    const { productId } = req.body;
    const { userId, email } = req.userInfo;

    const user = await UserModel.findOne({
      where: {
        id: userId,
        email,
      },
    });

    if (!user) {
      return buildResponseMessage(res, 'User not found.', 404);
    }

    const existingItem = await WishlistModel.findOne({ where: { userId, productId } });

    if (existingItem) {
      return buildResponseMessage(res, 'Product already in wishlist.', 400);
    }

    await WishlistModel.create({ userId, productId });
    return buildResponseMessage(res, 'Add product to wishlist successfully.', 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to add product to wishlist.';
    next(error);
  }
}

async function deleteProductFromWishlist(req, res, next) {
  try {
    const { productId } = req.body;
    const { userId, email } = req.userInfo;

    const user = await UserModel.findOne({
      where: {
        id: userId,
        email,
      },
    });

    if (!user) {
      return buildResponseMessage(res, 'User not found.', 404);
    }

    const item = await WishlistModel.findOne({ where: { userId, productId } });

    if (!item) {
      return buildResponseMessage(res, 'Product not found in wishlist.', 404);
    }

    await item.destroy();
    return buildResponseMessage(res, 'Remove product from wishlist successfully.', 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to remove product from wishlist.';
    next(error);
  }
}

async function getAllWishlistOfUser(req, res, next) {
  try {
    const { userId, email } = req.userInfo;
    const currentPage = parseInt(req.query.page, 10);
    const pageSize = parseInt(req.query.pageSize, 10);

    const user = await UserModel.findOne({
      where: {
        id: userId,
        email,
      },
    });

    if (!user) {
      return buildResponseMessage(res, 'User not found.', 404);
    }

    const filterableFields = {};

    const {
      where,
      order,
      limit,
      offset,
    } = parseQueryParams(req.query, filterableFields);

    const wishlists = await WishlistModel.findAndCountAll({
      where: {
        ...where,
        userId: { [Op.eq]: userId },
      },
      order,
      limit,
      offset,
      include: [
        {
          model: ProductModel,
          as: 'product',
          include: [
            {
              model: CategoryModel,
              as: 'category',
              attributes: ['name'],
            },
          ],
        },
      ],
    });

    const totalItemsFiltered = wishlists.count;
    const totalItemsUnfiltered = await WishlistModel.count();

    return buildResultListResponse(
      res,
      'Get all wishlists of user successfully.',
      currentPage,
      pageSize,
      totalItemsFiltered,
      totalItemsUnfiltered,
      {
        wishlists: wishlists.rows,
      },
      200,
    );
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to get all wishlists.';
    next(error);
  }
}

async function wishlistStatistics(req, res, next) {
  try {
    const currentPage = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;

    const filterableFields = {
      productId: 'number', // Example of filterable fields
      // Add more filterable fields as needed
    };

    const { where, limit, offset } = parseQueryParams(req.query, filterableFields);

    const wishlists = await WishlistModel.findAndCountAll({
      where,
      limit,
      offset,
      attributes: [
        'product_id',
        [sequelize.fn('COUNT', sequelize.col('product_id')), 'wishCount'],
      ],
      include: {
        model: ProductModel,
        as: 'product',
        attributes: ['id', 'name', 'description', 'thumb_image_url'],
      },
      group: ['product_id', 'product.id'],
    });

    // Sort the data by wishCount in JavaScript after fetching
    wishlists.rows.sort((a, b) => b.dataValues.wishCount - a.dataValues.wishCount);

    const totalItemsFiltered = wishlists.count.length;
    const totalItemsUnfiltered = await WishlistModel.count();

    return buildResultListResponse(
      res,
      'Get wishlist statistics successfully.',
      currentPage,
      pageSize,
      totalItemsFiltered,
      totalItemsUnfiltered,
      {
        wishlists: wishlists.rows,
      },
      200,
    );
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to get wishlist statistics.';
    next(error);
  }
}


module.exports = {
  addWishlist,
  deleteProductFromWishlist,
  getAllWishlistOfUser,
  wishlistStatistics,
};
