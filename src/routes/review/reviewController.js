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
    const { productId } = req.params;
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
        productId,
      },
    });

    if (isReviewed) {
      return buildResponseMessage(res, 'You has already give review on this product.', 400);
    }

    const product = await ProductModel.findByPk(productId);
    if (!product) {
      return buildResponseMessage(res, 'Product not found.', 404);
    }

    const payload = req.body;
    let imagesUrl = [];
    if (req.files) {
      const { feedbackImages } = req.files;
      if (feedbackImages) {
        imagesUrl = await uploadImages(feedbackImages, 'ecommerce_reviews_images');
      }
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

async function getCountReviewStarProduct(req, res, next) {
  try {
    const productId  = parseInt(req.params.productId, 10);

    const totalReviews = await ReviewModel.count({ where: { productId}});
    const totalZeroStar = await ReviewModel.count({ where: { productId, rating: 0 }});
    const totalOneStar = await ReviewModel.count({ where: { productId, rating: 1 }});
    const totalTwoStar = await ReviewModel.count({ where: { productId, rating: 2 }});
    const totalThreeStar = await ReviewModel.count({ where: { productId, rating: 3 }});
    const totalFourStar = await ReviewModel.count({ where: { productId, rating: 4 }});
    const totalFiveStar = await ReviewModel.count({ where: { productId, rating: 5 }});

    return buildSuccessResponse(
      res,
      'Get count star reviews from product successfully.',
      {
        totalReviews,
        totalZeroStar,
        totalOneStar,
        totalTwoStar,
        totalThreeStar,
        totalFourStar,
        totalFiveStar,
      },
      200,
    );
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to get all list reviews from product.';
    next(error);
  }
}

module.exports = {
  addReviewProduct,
  getCountReviewStarProduct,
};
