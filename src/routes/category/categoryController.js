const CategoryModel = require('../../database/models/category');
const {
  buildSuccessResponse,
  buildResponseMessage,
} = require('../shared');


async function addCategory(req, res, next) {
  try {
    const payload = req.body;
    const newCategory = await CategoryModel.create(payload);
    return buildSuccessResponse(res, 'Add new category successfully.', {
      category: newCategory,
    }, 201);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to add new category.';
    next(error);
  }
}

async function getAllCategories(req, res, next) {
  try {
    const categories = await CategoryModel.findAll();
    return buildSuccessResponse(res, 'Get all categories successfully.', {
      categories: categories || [],
    }, 200);
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
    await category.destroy();
    return buildResponseMessage(res, 'Delete category successfully.', 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to delete category.';
    next(error);
  }
}

async function updateCategory(req, res, next) {
  try {
    const { categoryId } = req.params;
    const payload = req.body;
    const category = await CategoryModel.findByPk(categoryId);
    if (!category) {
      return buildResponseMessage(res, 'Category not found.', 404);
    }
    await category.update(payload);
    await category.reload();
    return buildSuccessResponse(res, 'Update category successfully.', {
      category,
    }, 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to update category.';
    next(error);
  }
}

module.exports = {
  addCategory,
  getAllCategories,
  getCategoryDetails,
  deleteCategory,
  updateCategory,
};
