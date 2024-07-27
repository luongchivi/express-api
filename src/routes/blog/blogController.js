const slugify = require('slugify');
const BlogModel = require('../../database/models/blog');
const UserModel = require('../../database/models/user');
const {
  buildResponseMessage,
  buildErrorResponse,
  parseQueryParams,
  buildResultListResponse,
} = require('../shared');
const {
  uploadImages,
  deleteImages,
} = require('../../lib/cloudinary');


async function createBlog(req, res, next) {
  let imagesUrl;
  try {
    const {
      userId,
      email,
    } = req.userInfo;
    const user = await UserModel.findOne({
      where: {
        id: userId,
        email,
      },
    });

    if (!user) {
      return buildResponseMessage(res, 'User not found.', 404);
    }

    const { title } = req.body;
    const payload = req.body;
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
    if (imagesUrl) {
      await deleteImages(imagesUrl, 'ecommerce_blog_images');
    }
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to create new blog.';
    next(error);
  }
}

async function getBlog(req, res, next) {
  try {
    const { blogId } = req.params;

    const blog = await BlogModel.findByPk(
      blogId,
      {
        include: {
          model: UserModel,
          as: 'user',
          attributes: {
            exclude: ['password', 'deletedAt', 'refreshToken', 'passwordResetToken', 'passwordResetTokenExpires', 'passwordChangedAt'],
          },
        },
      },
    );

    if (!blog) {
      return buildResponseMessage(res, 'Blog not found.', 404);
    }

    return buildErrorResponse(res, 'Get blog successfully.', {
      blog,
    }, 201);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to get blog.';
    next(error);
  }
}

async function updateBlog(req, res, next) {
  try {
    //

  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to get blog.';
    next(error);
  }
}

async function getAllBlog(req, res, next) {
  try {
    const currentPage = parseInt(req.query.page, 10);
    const pageSize = parseInt(req.query.pageSize, 10);

    const filterableFields = {
      title: 'string',
      userId: 'number',
      createdAt: 'date',
    };

    const {
      where,
      order,
      limit,
      offset,
    } = parseQueryParams(req.query, filterableFields);

    const blogs = await BlogModel.findAndCountAll({
      where,
      order,
      limit,
      offset,
    });

    const totalItemsFiltered = blogs.count;
    const totalItemsUnfiltered = await BlogModel.count();

    return buildResultListResponse(
      res,
      'Get all blogs successfully.',
      currentPage,
      pageSize,
      totalItemsFiltered,
      totalItemsUnfiltered,
      {
        blogs: blogs.rows,
      },
      200,
    );
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to get all list blogs.';
    next(error);
  }
}

module.exports = {
  createBlog,
  getBlog,
  updateBlog,
  getAllBlog,
};
