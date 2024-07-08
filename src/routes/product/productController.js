const ProductModel = require("../../database/models/product");
const CategoryModel = require("../../database/models/category");
const SupplierModel = require("../../database/models/supplier");
const {
  buildSuccessResponse,
  buildResponseMessage,
  parseQueryParams,
  buildResultListResponse
} = require('../shared');
const slugify = require('slugify')
const UserModel = require('../../database/models/user');
const { Op } = require('sequelize');

async function getAllProducts(req, res, next) {
  try {
    const currentPage = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);

    const filterableFields = {
      name: 'string',
      discount: 'number',
      unitPrice: 'number',
      unitsInStock: 'number',
      unitsOnOrder: 'number',
      unitsSold: 'number',
      createdAt: 'date',
    };

    const { categoryName } = req.query;

    const categoryFilter = {};
    if (categoryName) {
      categoryFilter.name = {
        [Op.iLike]: `%${categoryName}%`
      }
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
          where: categoryFilter
        },
        {
          model: SupplierModel,
          as: 'supplier'
        }
      ]
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
        products: products.rows
      },
      200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to get all products.';
    next(error);
  }
}

async function addProduct(req, res, next) {
  try {
    const payload = req.body;
    const { categoryId, supplierId, name } = payload;
    payload.slug = slugify(name.toLowerCase());

    const category = await CategoryModel.findByPk(categoryId);

    if (!category) {
      return buildResponseMessage(res, 'Not found category.', 404);
    }

    const supplier = await SupplierModel.findByPk(supplierId);

    if (!supplier) {
      return buildResponseMessage(res, 'Not found supplier.', 404);
    }

    const product = await ProductModel.create(payload);

    return buildSuccessResponse(res, 'Create new product successfully.', {
      product
    }, 200);
  } catch (error) {
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
          as: 'supplier'
        },
        {
          model: CategoryModel,
          as: 'category'
        }
      ]
    });

    if (!product) {
      return buildResponseMessage(res, 'Not found product.', 404);
    }

    return buildSuccessResponse(res, 'Get product details successfully.', {
      product
    }, 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to get product details.';
    next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const { productId } = req.params;

    const product = await ProductModel.findByPk(productId);

    if (!product) {
      return buildResponseMessage(res, 'Not found product.', 404);
    }
    await product.destroy();
    return buildSuccessResponse(res, 'Delete product successfully.', {
      product
    }, 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to delete product.';
    next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { productId } = req.params;
    const payload = req.body;
    const { categoryId, supplierId, name } = payload;
    payload.slug = slugify(name.toLowerCase());

    const category = await CategoryModel.findByPk(categoryId);

    if (!category && categoryId) {
      return buildResponseMessage(res, 'Not found category.', 404);
    }

    const supplier = await SupplierModel.findByPk(supplierId);

    if (!supplier && supplierId) {
      return buildResponseMessage(res, 'Not found supplier.', 404);
    }

    const product = await ProductModel.findByPk(productId);

    if (!product) {
      return buildResponseMessage(res, 'Not found product.', 404);
    }
    await product.update(payload);
    return buildSuccessResponse(res, 'Update product successfully.', {
      product
    }, 200);
  } catch (error) {
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
  deleteProduct
};
