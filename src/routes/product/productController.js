const slugify = require('slugify');
const { Op } = require('sequelize');
const ProductModel = require('../../database/models/product');
const CategoryModel = require('../../database/models/category');
const SupplierModel = require('../../database/models/supplier');
const CartItemModel = require('../../database/models/cartItem');
const CartModel = require('../../database/models/cart');
const sequelize = require('../../../config/database');
const {
  buildSuccessResponse,
  buildResponseMessage,
  parseQueryParams,
  buildResultListResponse,
} = require('../shared');
const {
  uploadImages,
  uploadImage,
  deleteImages,
  deleteImage,
} = require('../../lib/cloudinary');


async function getAllProducts(req, res, next) {
  try {
    const currentPage = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);

    const filterableFields = {
      name: 'string',
      unitPrice: 'number',
      unitsInStock: 'number',
      unitsOnOrder: 'number',
      unitsSold: 'number',
      createdAt: 'date',
      averageRating: 'array',
    };

    const { categoryName } = req.query;

    let categoryFilter;
    if (categoryName) {
      categoryFilter = {};
      categoryFilter.name = {
        [Op.iLike]: `%${categoryName}%`,
      };
    }

    const { where, order, limit, offset } = parseQueryParams(req.query, filterableFields);

    const products = await ProductModel.findAndCountAll({
      where,
      order,
      limit,
      offset,
      include: [
        {
          model: CategoryModel,
          as: 'category',
          where: categoryFilter,
        },
        {
          model: SupplierModel,
          as: 'supplier',
        },
      ],
    });

    const totalItemsFiltered = products.count;
    const totalItemsUnfiltered = await ProductModel.count();

    return buildResultListResponse(
      res,
      'Get all list products successfully.',
      currentPage,
      pageSize,
      totalItemsFiltered,
      totalItemsUnfiltered,
      {
        products: products.rows,
      },
      200,
    );
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to get all products.';
    next(error);
  }
}

async function addProduct(req, res, next) {
  let imagesUrl = [];
  let thumbImageUrl;
  try {
    const payload = req.body;
    const { categoryId, supplierId, name } = payload;
    payload.slug = slugify(name.toLowerCase());
    payload.name = name.trim();

    if (categoryId !== 'null') {
      const category = await CategoryModel.findByPk(categoryId);

      if (!category && categoryId) {
        return buildResponseMessage(res, 'Not found category.', 404);
      }
    } else {
      payload.categoryId = null;
    }

    if (supplierId !== 'null') {
      const supplier = await SupplierModel.findByPk(supplierId);

      if (!supplier && supplierId) {
        return buildResponseMessage(res, 'Not found supplier.', 404);
      }
    } else {
      payload.supplierId = null;
    }

    if (req.files) {
      const { thumbImage, images } = req.files;

      if (images) {
        if (images.length > 0) {
          imagesUrl = await uploadImages(images, 'ecommerce_products_images');
        }
        payload.imagesUrl = imagesUrl;
      }

      if (thumbImage) {
        if (thumbImage.length > 0) {
          thumbImageUrl = await uploadImage(...thumbImage, 'ecommerce_products_thumb_images');
        }
        payload.thumbImageUrl = thumbImageUrl;
      }
    }

    const product = await ProductModel.create(payload);

    return buildSuccessResponse(res, 'Create new product successfully.', {
      product,
    }, 201);
  } catch (error) {
    if (imagesUrl) { await deleteImages(imagesUrl, 'ecommerce_products_images'); }
    if (thumbImageUrl) { await deleteImage(thumbImageUrl, 'ecommerce_products_thumb_images'); }
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to create new product.';
    next(error);
  }
}

async function getProductDetails(req, res, next) {
  try {
    const { productId } = req.params;

    const product = await ProductModel.findByPk(productId, {
      include: [
        {
          model: SupplierModel,
          as: 'supplier',
        },
        {
          model: CategoryModel,
          as: 'category',
        },
      ],
    });

    if (!product) {
      return buildResponseMessage(res, 'Not found product.', 404);
    }

    return buildSuccessResponse(res, 'Get product details successfully.', {
      product,
    }, 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to get product details.';
    next(error);
  }
}

async function deleteProduct(req, res, next) {
  const transaction = await sequelize.transaction();
  try {
    const { productId } = req.params;

    const product = await ProductModel.findByPk(productId, {
      transaction,
    });

    const { thumbImageUrl, imagesUrl } = product;

    if (imagesUrl) {
      await deleteImages(imagesUrl, 'ecommerce_products_images');
    }

    if (thumbImageUrl) {
      await deleteImage(thumbImageUrl, 'ecommerce_products_thumb_images');
    }

    if (!product) {
      return buildResponseMessage(res, 'Not found product.', 404);
    }
    await product.destroy({ transaction });
    await transaction.commit();
    return buildSuccessResponse(res, 'Delete product successfully.', {
      product,
    }, 200);
  } catch (error) {
    await transaction.rollback();
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to delete product.';
    next(error);
  }
}

async function updateProduct(req, res, next) {
  const transaction = await sequelize.transaction();
  let imagesUrl = [];
  let thumbImageUrl;
  try {
    const { productId } = req.params;
    const payload = req.body;
    const { categoryId, supplierId, name, unitPrice } = payload;

    if (name) {
      payload.slug = slugify(name.toLowerCase());
    }

    if (categoryId !== 'null') {
      const category = await CategoryModel.findByPk(categoryId);

      if (!category && categoryId) {
        return buildResponseMessage(res, 'Not found category.', 404);
      }
    } else {
      payload.categoryId = null;
    }

    if (supplierId !== 'null') {
      const supplier = await SupplierModel.findByPk(supplierId);

      if (!supplier && supplierId) {
        return buildResponseMessage(res, 'Not found supplier.', 404);
      }
    } else {
      payload.supplierId = null;
    }

    const product = await ProductModel.findByPk(productId, {
      include: [
        {
          model: CategoryModel,
          as: 'category',
        },
        {
          model: SupplierModel,
          as: 'supplier',
        },
      ],
    });

    if (!product) {
      return buildResponseMessage(res, 'Not found product.', 404);
    }

    // Update image in cloudinary
    if (req.files) {
      const { thumbImage, images } = req.files;
      if (images) {
        await deleteImages(product.imagesUrl, 'ecommerce_products_images');
        if (images.length > 0) {
          imagesUrl = await uploadImages(images, 'ecommerce_products_images');
        }
        payload.imagesUrl = imagesUrl;
      }

      if (thumbImage) {
        await deleteImage(product.thumbImageUrl, 'ecommerce_products_thumb_images');
        if (thumbImage.length > 0) {
          thumbImageUrl = await uploadImage(...thumbImage, 'ecommerce_products_thumb_images');
        }
        payload.thumbImageUrl = thumbImageUrl;
      }
    }

    await product.update(payload, { transaction });
    await product.reload({ transaction });

    if (unitPrice) {
      const cartItems = await CartItemModel.findAll({ where: { productId }, transaction });

      // Cập nhật lại giá của từng sản phẩm trong giỏ hàng chi tiết cartItems
      for (const cartItem of cartItems) {
        const newTotalPrice = unitPrice * cartItem.quantity;
        await cartItem.update({
          unitPrice,
          totalPrice: newTotalPrice,
        }, { transaction });

        await cartItem.reload({ transaction });

        const cart = await CartModel.findByPk(cartItem.cartId, { transaction });
        if (!cart) {
          await transaction.rollback();
          return buildResponseMessage(res, 'Not found cart.', 404);
        }

        const cartItemsInCart = await CartItemModel.findAll({
          where: { cartId: cart.id },
          transaction,
        });

        // Cập nhật lại giá tiền của giỏ hàng cart
        const newTotalQuantityCart = cartItemsInCart.reduce((sum, item) => sum + item.quantity, 0);
        const newTotalPriceCart = cartItemsInCart.reduce((sum, item) => sum + item.totalPrice, 0);

        await cart.update({
          totalQuantity: newTotalQuantityCart,
          totalPrice: newTotalPriceCart,
        }, { transaction });

        await cart.reload({ transaction });
      }
    }

    await transaction.commit();
    return buildSuccessResponse(res, 'Update product successfully.', {
      product,
    }, 200);
  } catch (error) {
    await transaction.rollback();
    if (imagesUrl) { await deleteImages(imagesUrl, 'ecommerce_products_images'); }
    if (thumbImageUrl) { await deleteImage(thumbImageUrl, 'ecommerce_products_thumb_images'); }
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to update product.';
    next(error);
  }
}

module.exports = {
  getAllProducts,
  addProduct,
  getProductDetails,
  updateProduct,
  deleteProduct,
};
