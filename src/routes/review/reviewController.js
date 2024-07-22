require('dotenv').config({ path: `${process.cwd()}/.env` });
const ReviewModel = require('../../database/models/review');
const UserModel = require('../../database/models/user');
const ProductModel = require('../../database/models/product');
const {
  buildResponseMessage,
  buildSuccessResponse,
} = require('../shared');
const { uploadImages } = require('../../lib/cloudinary');


async function addReviewProduct(req, res, next) {
  try {
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

    const isReviewed = await ReviewModel.findOne({
      where: {
        userId: user.id,
      },
    });

    if (isReviewed) {
      return buildResponseMessage(res, 'You has already give review on this product.', 400);
    }

    const { productId } = req.params;
    const product = await ProductModel.findByPk(productId);
    if (!product) {
      return buildResponseMessage(res, 'Product not found.', 404);
    }

    const payload = req.body;
    const { feedbackImages } = req.files;
    let imagesUrl = [];
    if (feedbackImages.length > 0) {
      imagesUrl = await uploadImages(feedbackImages, 'ecommerce_reviews_images');
    }

    // Create the review
    const newReview = await ReviewModel.create({
      ...payload,
      userId: user.id,
      productId: product.id,
      feedbackImagesUrl: imagesUrl, // Add the image URLs to the review
    });

    return buildSuccessResponse(res, 'Add new review of product successfully.', {
      review: newReview,
    }, 201);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to add new review for product.';
    next(error);
  }
}

module.exports = {
  addReviewProduct,
};
