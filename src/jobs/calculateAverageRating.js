const ReviewModel = require('../database/models/review');
const ProductModel = require('../database/models/product');


module.exports = async () => {
  try {
    const products = await ProductModel.findAll();

    if (products.length === 0) {
      console.error('Cron job calculate average rating: Not found products.');
      return;
    }
    for (const product of products) {
      const reviews = await ReviewModel.findAll({
        where: {
          productId: product.id,
        },
      });

      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;

        await product.update({ averageRating });
      }
    }

    console.log('Updated average ratings for all products.');
  } catch (error) {
    console.error('Error at cron job calculate average rating:', error);
  }
};
