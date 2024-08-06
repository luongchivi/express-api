const SupplierModel = require('../../database/models/supplier');
const ProductModel = require('../../database/models/product');
const {
  buildSuccessResponse,
  buildResponseMessage,
  parseQueryParams,
  buildResultListResponse,
} = require('../shared');
const { Op } = require('sequelize');
const CategoryModel = require('../../database/models/category');


async function addSupplier(req, res, next) {
  try {
    const payload = req.body;
    const newSupplier = await SupplierModel.create(payload);
    return buildSuccessResponse(res, 'Add new supplier successfully.', {
      supplier: newSupplier,
    }, 201);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to add new supplier.';
    next(error);
  }
}

async function getAllSuppliers(req, res, next) {
  try {
    const currentPage = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);

    const filterableFields = {};

    const { where, order, limit, offset } = parseQueryParams(req.query, filterableFields);

    const suppliers = await SupplierModel.findAndCountAll({
      where,
      order,
      limit,
      offset,
    });

    const totalItemsFiltered = suppliers.count;
    const totalItemsUnfiltered = await SupplierModel.count();

    return buildResultListResponse(
      res,
      'Get all list suppliers successfully.',
      currentPage,
      pageSize,
      totalItemsFiltered,
      totalItemsUnfiltered,
      {
        suppliers: suppliers.rows,
      },
      200,
    );
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to get all list suppliers.';
    next(error);
  }
}

async function getSupplierDetails(req, res, next) {
  try {
    const { supplierId } = req.params;
    const supplier = await SupplierModel.findByPk(supplierId, {
      include: {
        model: ProductModel,
        as: 'products',
      },
    });

    if (!supplier) {
      return buildResponseMessage(res, 'No found supplier.', 404);
    }

    return buildSuccessResponse(res, 'Get supplier details successfully.', {
      supplier,
    }, 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to get supplier details.';
    next(error);
  }
}

async function deleteSupplier(req, res, next) {
  try {
    const { supplierId } = req.params;
    const supplier = await SupplierModel.findByPk(supplierId);

    if (!supplier) {
      return buildResponseMessage(res, 'No found supplier.', 404);
    }

    await supplier.destroy();
    return buildResponseMessage(res, 'Delete supplier successfully.', 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to delete supplier.';
    next(error);
  }
}

async function updateSupplier(req, res, next) {
  try {
    const { supplierId } = req.params;
    const payload = req.body;
    const supplier = await SupplierModel.findByPk(supplierId);

    if (!supplier) {
      return buildResponseMessage(res, 'No found supplier.', 404);
    }

    await supplier.update(payload);
    return buildSuccessResponse(res, 'Update supplier successfully.', {
      supplier,
    }, 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to update supplier.';
    next(error);
  }
}

module.exports = {
  addSupplier,
  getAllSuppliers,
  getSupplierDetails,
  deleteSupplier,
  updateSupplier,
};
