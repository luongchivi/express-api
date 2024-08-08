const slugify = require('slugify');
const BlogModel = require('../../database/models/blog');
const UserModel = require('../../database/models/user');
const {
  buildResponseMessage,
  buildErrorResponse,
  parseQueryParams,
  buildResultListResponse,
  buildSuccessResponse,
} = require('../shared');
const {
  uploadImages,
  deleteImages,
  uploadImage,
  deleteImage,
} = require('../../lib/cloudinary');
const sequelize = require('../../../config/database');


async function createBlog(req, res, next) {
  let thumbImageUrl;
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

    if(req.files) {
      const { thumbImage } = req.files;
      if (thumbImage) {
        if (thumbImage.length > 0) {
          thumbImageUrl = await uploadImage(...thumbImage, 'ecommerce_blog_thumb_images');
        }
        payload.thumbImageUrl = thumbImageUrl;
      }
    }

    const newBlog = await BlogModel.create(payload);
    return buildErrorResponse(res, 'Create new blog successfully.', {
      blog: newBlog,
    }, 201);
  } catch (error) {
    if (thumbImageUrl) { await deleteImage(thumbImageUrl, 'ecommerce_blog_thumb_images'); }
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
          attributes: ["firstName", "lastName"],
        },
      },
    );

    if (!blog) {
      return buildResponseMessage(res, 'Blog not found.', 404);
    }

    return buildErrorResponse(res, 'Get blog successfully.', {
      blog,
    }, 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to get blog.';
    next(error);
  }
}

async function updateBlog(req, res, next) {
  const transaction = await sequelize.transaction();
  let thumbImageUrl;
  try {
    const { blogId } = req.params;
    const payload = req.body;

    const blog = await BlogModel.findByPk(blogId, {
      transaction,
    });

    if (!blog) {
      return buildResponseMessage(res, 'Not found blog.', 404);
    }

    // Update image in cloudinary
    if (req.files) {
      const { thumbImage } = req.files;
      if (thumbImage) {
        await deleteImage(blog.thumbImageUrl, 'ecommerce_blog_thumb_images');
        if (thumbImage.length > 0) {
          thumbImageUrl = await uploadImage(...thumbImage, 'ecommerce_blog_thumb_images');
        }
        payload.thumbImageUrl = thumbImageUrl;
      }
    }

    await blog.update(payload,{ transaction });
    await transaction.commit();
    return buildSuccessResponse(res, 'Update blog successfully.',{
      blog,
    }, 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to update blog.';
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
      include: [
        {
          model: UserModel,
          as: 'user',
          attributes: ["firstName", "lastName"],
        }
      ]
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

async function deleteBlog(req, res, next) {
  const transaction = await sequelize.transaction();
  try {
    const { blogId } = req.params;

    const blog = await BlogModel.findByPk(blogId, {
      transaction,
    });

    if (!blog) {
      return buildResponseMessage(res, 'Not found blog.', 404);
    }

    const { thumbImageUrl } = blog;

    if (thumbImageUrl) {
      await deleteImage(thumbImageUrl, 'ecommerce_blog_thumb_images');
    }

    await blog.destroy({ transaction });
    await transaction.commit();
    return buildResponseMessage(res, 'Delete blog successfully.', 200);
  } catch (error) {
    await transaction.rollback();
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to delete blogs.';
    next(error);
  }
}

module.exports = {
  createBlog,
  getBlog,
  updateBlog,
  getAllBlog,
  deleteBlog,
};
