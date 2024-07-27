const CategoryModel = require('../../database/models/category');
const SupplierModel = require('../../database/models/supplier');
const CategorySupplierModel = require('../../database/models/categorySupplier');
const {
  buildSuccessResponse,
  buildResponseMessage,
  parseQueryParams,
  buildResultListResponse,
} = require('../shared');
const {
  uploadImage,
  deleteImage,
} = require('../../lib/cloudinary');


async function addCategory(req, res, next) {
  let iconImageUrl; let
    thumbImageUrl;
  try {
    const payload = req.body;
    const { iconImage, thumbImage } = req.files;

    if (iconImage) {
      if (iconImage.length > 0) {
        iconImageUrl = await uploadImage(...iconImage, 'ecommerce_category_icon_images');
      }
      payload.iconImageUrl = iconImageUrl;
    }

    if (thumbImage) {
      if (thumbImage.length > 0) {
        thumbImageUrl = await uploadImage(...thumbImage, 'ecommerce_category_thumb_images');
      }
      payload.thumbImageUrl = thumbImageUrl;
    }

    const newCategory = await CategoryModel.create(payload);
    return buildSuccessResponse(res, 'Add new category successfully.', {
      category: newCategory,
    }, 201);
  } catch (error) {
    if (iconImageUrl) { await deleteImage(iconImageUrl, 'ecommerce_category_icon_images'); }
    if (thumbImageUrl) { await deleteImage(thumbImageUrl, 'ecommerce_category_thumb_images'); }
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to add new category.';
    next(error);
  }
}

async function getAllCategories(req, res, next) {
  try {
    const currentPage = parseInt(req.query.page, 10);
    const pageSize = parseInt(req.query.pageSize, 10);

    const filterableFields = {};

    const {
      where,
      order,
      limit,
      offset,
    } = parseQueryParams(req.query, filterableFields);

    const categories = await CategoryModel.findAndCountAll({
      where,
      order,
      limit,
      offset,
      attributes: { exclude: ['password', 'deletedAt'] },
      include: {
        model: SupplierModel,
        as: 'suppliers',
        attributes: { exclude: [CategorySupplierModel] },
        through: { attributes: [] },
      },
    });

    const totalItemsFiltered = categories.count;
    const totalItemsUnfiltered = await CategoryModel.count();

    return buildResultListResponse(
      res,
      'Get all users successfully.',
      currentPage,
      pageSize,
      totalItemsFiltered,
      totalItemsUnfiltered,
      {
        categories: categories.rows,
      },
      200,
    );
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to get all categories.';
    next(error);
  }
}

async function getCategoryDetails(req, res, next) {
  try {
    const { categoryId } = req.params;
    const category = await CategoryModel.findByPk(categoryId);
    if (!category) {
      return buildResponseMessage(res, 'Category not found.', 404);
    }
    return buildSuccessResponse(res, 'Get category details successfully.', {
      category,
    }, 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to get category details.';
    next(error);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const { categoryId } = req.params;
    const category = await CategoryModel.findByPk(categoryId);
    if (!category) {
      return buildResponseMessage(res, 'Category not found.', 404);
    }

    if (category.iconImageUrl) {
      await deleteImage(category.iconImageUrl, 'ecommerce_category_icon_images');
    }
    if (category.thumbImageUrl) {
      await deleteImage(category.thumbImageUrl, 'ecommerce_category_thumb_images');
    }

    await category.destroy();
    return buildResponseMessage(res, 'Delete category successfully.', 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to delete category.';
    next(error);
  }
}

async function updateCategory(req, res, next) {
  let iconImageUrl; let
    thumbImageUrl;
  try {
    const { categoryId } = req.params;
    const payload = req.body;
    const category = await CategoryModel.findByPk(categoryId);
    if (!category) {
      return buildResponseMessage(res, 'Category not found.', 404);
    }

    const { iconImage, thumbImage } = req.files;

    if (iconImage) {
      if (category.iconImageUrl) {
        await deleteImage(category.iconImageUrl, 'ecommerce_category_icon_images');
      }
      if (iconImage.length > 0) {
        iconImageUrl = await uploadImage(...iconImage, 'ecommerce_category_icon_images');
      }
      payload.iconImageUrl = iconImageUrl;
    }

    if (thumbImage) {
      if (category.thumbImageUrl) {
        await deleteImage(category.thumbImageUrl, 'ecommerce_category_thumb_images');
      }
      if (thumbImage.length > 0) {
        thumbImageUrl = await uploadImage(...thumbImage, 'ecommerce_category_thumb_images');
      }
      payload.thumbImageUrl = thumbImageUrl;
    }

    await category.update(payload);
    await category.reload();
    return buildSuccessResponse(res, 'Update category successfully.', {
      category,
    }, 200);
  } catch (error) {
    if (iconImageUrl) { await deleteImage(iconImageUrl, 'ecommerce_category_icon_images'); }
    if (thumbImageUrl) { await deleteImage(thumbImageUrl, 'ecommerce_category_thumb_images'); }
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to update category.';
    next(error);
  }
}

async function assignSupplier(req, res, next) {
  try {
    const { categoryId } = req.params;
    const { companyName } = req.body;
    const category = await CategoryModel.findByPk(categoryId);
    if (!category) {
      return buildResponseMessage(res, 'Category not found.', 404);
    }

    const supplier = await SupplierModel.findOne({
      where: {
        companyName,
      },
    });

    if (!supplier) {
      return buildResponseMessage(res, 'Supplier not found.', 404);
    }

    await CategorySupplierModel.create({
      categoryId: category.id,
      supplierId: supplier.id,
    });

    return buildResponseMessage(res, 'Assign new supplier to category successfully.', 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to assign new supplier to category.';
    next(error);
  }
}

async function deleteSupplierAssign(req, res, next) {
  try {
    const { categoryId } = req.params;
    const { companyName } = req.body;
    const category = await CategoryModel.findByPk(categoryId);
    if (!category) {
      return buildResponseMessage(res, 'Category not found.', 404);
    }

    const supplier = await SupplierModel.findOne({
      where: {
        companyName,
      },
    });

    if (!supplier) {
      return buildResponseMessage(res, 'Supplier not found.', 404);
    }

    await CategorySupplierModel.destroy({
      where: {
        categoryId: category.id,
        supplierId: supplier.id,
      },
    });

    return buildResponseMessage(res, 'Delete supplier assign category successfully.', 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to delete supplier assign to category.';
    next(error);
  }
}

module.exports = {
  addCategory,
  getAllCategories,
  getCategoryDetails,
  deleteCategory,
  updateCategory,
  assignSupplier,
  deleteSupplierAssign,
};
