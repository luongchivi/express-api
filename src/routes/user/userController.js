require('dotenv').config({ path: `${process.cwd()}/.env` });
const UserModel = require('../../database/models/user');
const RoleModel = require('../../database/models/role');
const PermissionModel = require('../../database/models/permission');
const UserRoleModel = require('../../database/models/userRole');
const RolePermissionModel = require('../../database/models/rolePermission');
const AddressModel = require('../../database/models/address');
const sequelize = require('../../../config/database');
const {
  buildSuccessResponse,
  buildResponseMessage,
  parseQueryParams,
  buildResultListResponse,
  sanitizeUserResponse,
} = require('../shared');
const EmailService = require('../../lib/EmailService');
const uniqid = require('uniqid');


async function getAllUsers(req, res, next) {
  try {
    const currentPage = parseInt(req.query.page, 10);
    const pageSize = parseInt(req.query.pageSize, 10);

    const filterableFields = {
      firstName: 'string',
      lastName: 'string',
      email: 'string',
      isActive: 'boolean',
      createdAt: 'date',
    };

    const {
      where,
      order,
      limit,
      offset,
    } = parseQueryParams(req.query, filterableFields);

    const users = await UserModel.findAndCountAll({
      where,
      order,
      limit,
      offset,
      attributes: {
        exclude: [
          'password', 'deletedAt', 'refreshToken', 'passwordResetToken',
          'passwordResetTokenExpires', 'verifyEmailTokenExpires', 'verifyEmailToken',
        ],
      },
      include: [
        {
          model: RoleModel,
          as: 'roles',
        }
      ]
    });

    const totalItemsFiltered = users.count;
    const totalItemsUnfiltered = await UserModel.count();

    return buildResultListResponse(
      res,
      'Get all users successfully.',
      currentPage,
      pageSize,
      totalItemsFiltered,
      totalItemsUnfiltered,
      {
        users: users.rows,
      },
      200,
    );
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to get all users.';
    next(error);
  }
}

async function getUserDetails(req, res, next) {
  try {
    const { id } = req.params;

    const user = await UserModel.findByPk(id, {
      attributes: {
        exclude: ['password', 'deletedAt'],
      },
      include: {
        model: RoleModel,
        as: 'roles',
        attributes: { exclude: [UserRoleModel] },
        through: { attributes: [] },
        include: {
          model: PermissionModel,
          as: 'permissions',
          attributes: { exclude: [RolePermissionModel] },
          through: { attributes: [] },
        },
      },
    });

    if (!user) {
      return buildResponseMessage(res, 'User not found.', 404);
    }

    return buildSuccessResponse(res, 'Get user details successfully.', {
      user,
    }, 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to get user details.';
    next(error);
  }
}

async function updateUser(req, res, next) {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { firstName, lastName, email, ...payloadAddress } = req.body;

    if (email) {
      const existedEmail = await UserModel.findOne({
        where: {
          email,
        },
        transaction,
      })

      if (existedEmail) {
        await transaction.rollback();
        return buildResponseMessage(res, 'This email already existed.', 400);
      }
    }

    const user = await UserModel.findByPk(id, {
      include: [
        {
          model: AddressModel,
          as: 'address',
        }
      ],
      transaction,
    });

    if (!user) {
      await transaction.rollback();
      return buildResponseMessage(res, 'User not found.', 404);
    }

    if (email && email !== user.email) {
      const verifyEmailToken = uniqid();
      const emailService = new EmailService();
      const result = await emailService.sendMail('verifyEmail', { email, verifyEmailToken });
      if (!result.accepted && result.accepted.length !== 0) {
        return buildResponseMessage(res, 'Failed to send email to verify.', 400);
      }

      await user.update({
        firstName,
        lastName,
        email,
        isActive: false,
        hasVerifiedEmail: false,
        verifyEmailToken,
        verifyEmailTokenExpires: Date.now() + parseInt(process.env.VERIFY_EMAIL_TOKEN_EXPIRES, 10),
      }, { transaction });
    }  else {
      await user.update({ firstName, lastName }, { transaction });
      await user.address.update(payloadAddress, { transaction });
    }

    if (!user.address) {
      await AddressModel.create({ ...payloadAddress, userId: user.id }, { transaction });
    } else {
      await user.address.update(payloadAddress, { transaction });
    }

    await transaction.commit();
    await user.reload({ include: { model: AddressModel, as: 'address' } });
    const sanitizedUser = sanitizeUserResponse(user);
    return buildSuccessResponse(res, 'Update user successfully.', {
      user: sanitizedUser,
    }, 200);
  } catch (error) {
    await transaction.rollback();
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to update user.';
    next(error);
  }
}

async function softDelete(req, res, next) {
  try {
    const { id } = req.params;
    const user = await UserModel.findByPk(id);
    if (!user) {
      return buildResponseMessage(res, 'User not found.', 404);
    }
    await user.destroy();
    return buildResponseMessage(res, 'Soft delete user successfully.', 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to soft delete user.';
    next(error);
  }
}

async function assignRole(req, res, next) {
  try {
    const { id } = req.params;
    const { roleName } = req.body;
    const user = await UserModel.findByPk(id);
    if (!user) {
      return buildResponseMessage(res, 'User not found.', 404);
    }

    const role = await RoleModel.findOne({
      where: {
        name: roleName,
      },
    });

    if (!role) {
      return buildResponseMessage(res, 'Role not found.', 404);
    }

    await UserRoleModel.create({
      userId: user.id,
      roleId: role.id,
    });

    return buildResponseMessage(res, 'Assign new role to user successfully.', 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to assign role for user.';
    next(error);
  }
}

async function deleteRoleAssign(req, res, next) {
  try {
    const { id } = req.params;
    const { roleName } = req.body;
    const user = await UserModel.findByPk(id);

    if (!user) {
      return buildResponseMessage(res, 'User not found.', 404);
    }

    const role = await RoleModel.findOne({
      where: {
        name: roleName,
      },
    });

    if (!role) {
      return buildResponseMessage(res, 'Role not found.', 404);
    }

    await UserRoleModel.destroy({
      where: {
        userId: user.id,
        roleId: role.id,
      },
    });

    return buildResponseMessage(res, 'Delete role assign to user successfully.', 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to delete role assign for user.';
    next(error);
  }
}

async function getCurrentUser(req, res, next) {
  try {
    const {
      userId,
      email,
    } = req.userInfo;

    if (!userId || !email) {
      return buildResponseMessage(res, 'User info in request not found.', 400);
    }

    const user = await UserModel.findOne({
      where: {
        id: userId,
        email,
      },
      attributes: {
        exclude: [
          'password', 'deletedAt', 'passwordResetToken', 'verifyEmailTokenExpires', 'hasVerifiedEmail',
          'passwordResetTokenExpires', 'passwordChangedAt', 'verifyEmailToken'],
      },
      include: [
        {
          model: RoleModel,
          as: 'roles',
        },
        {
          model: AddressModel,
          as: 'address',
        }
      ]
    });

    if (!user) {
      return buildResponseMessage(res, 'User not found.', 404);
    }

    return buildSuccessResponse(res, 'Current user successfully.', {
      user,
    }, 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to get current user.';
    next(error);
  }
}

module.exports = {
  getAllUsers,
  getUserDetails,
  getCurrentUser,
  updateUser,
  softDelete,
  assignRole,
  deleteRoleAssign,
};
