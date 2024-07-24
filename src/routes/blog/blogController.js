const BlogModel = require("../../database/models/blog");
const UserModel = require("../../database/models/user");
const { buildResponseMessage,
  buildErrorResponse
} = require('../shared');
const {
  uploadImages,
  deleteImages
} = require('../../lib/cloudinary');
const slugify = require('slugify');

async function createBlog(req, res, next) {
  let imagesUrl;
  try {
    const { userId, email } = req.userInfo;
    const user = await UserModel.findOne({
      where: {
        id: userId,
        email,
      }
    });

    if (!user) {
      return buildResponseMessage(res, 'User not found.', 404);
    }

    const { title } = req.body;
    let payload = req.body;
    payload.slug = slugify(title.toLowerCase());
    payload.userId = user.id;

    const { images } = req.files;
    if (images) {
      imagesUrl = await uploadImages(images, 'ecommerce_blog_images');
      payload.imagesUrl = imagesUrl;
    }

    const newBlog = await BlogModel.create(payload);
    return buildErrorResponse(res, 'Create new blog successfully.', {
      blog: newBlog,
    }, 201);
  } catch (error) {
    if(imagesUrl) await deleteImages(imagesUrl, 'ecommerce_blog_images');
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to create new blog.';
    next(error);
  }
}

module.exports = {
  createBlog,
}
