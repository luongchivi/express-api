const UserModel = require('../../database/models/user');
const UserRoleModel = require('../../database/models/userRole');
const RoleModel = require('../../database/models/role');
const bcrypt = require('bcrypt');
const {
  generateAccessToken,
  generateFreshToken
} = require('../../middleware/authHandler');
const jwt = require('jsonwebtoken');
const {
  buildResponseMessage,
  buildSuccessResponse
} = require('../shared');
const sendMail = require('../../lib/sendMail');
const crypto = require('crypto');
const { Op } = require('sequelize');

async function signUp(req, res, next) {
  try {
    const newUser = await UserModel.create({
      ...req.body
    });

    const userRole = await RoleModel.findOne({
      where: {
        name: 'User'
      }
    });

    if (!userRole) {
      return buildResponseMessage(res, 'User role not found', 404);
    }

    await UserRoleModel.create({
      userId: newUser.id,
      roleId: userRole.id
    });

    const {
      id,
      email
    } = newUser;
    const {
      password: _,
      deletedAt,
      ...rest
    } = newUser.dataValues;

    const accessToken = generateAccessToken({
      userId: id,
      email
    });
    const refreshToken = generateFreshToken({
      userId: id,
      email
    });

    return buildSuccessResponse(res, 'SignUp successfully.', {
      user: rest,
      accessToken,
      refreshToken,
    }, 201);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'SignUp failed.';
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const {
      email,
      password
    } = req.body;
    const user = await UserModel.findOne({
      where: { email },
    });

    if (!user) {
      return buildResponseMessage(res, 'User does not exist.', 404);
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return buildResponseMessage(res, 'Username or password is incorrect.', 401);
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      email
    });
    const refreshToken = generateFreshToken({
      userId: user.id,
      email
    });

    // save refreshToken into database
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie(
      'refreshToken',
      refreshToken,
      {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 1000
      }
    );

    return buildSuccessResponse(res, 'Login successfully.', {
      accessToken,
      refreshToken
    }, 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Login failed.';
    next(error);
  }
}

async function refreshToken(req, res, next) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return buildResponseMessage(res, 'Refresh token is missing.', 401);
    }

    const refreshTokenDecoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);
    const {
      userId,
      email
    } = refreshTokenDecoded;

    const newAccessToken = generateAccessToken({
      userId,
      email
    });

    return buildSuccessResponse(res, 'Generate new accessToken successfully.', {
      accessToken: newAccessToken,
    }, 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Generate refreshToken failed.';
    next(error);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({
      where: {
        email
      }
    });

    if (!user) {
      return buildResponseMessage(res, 'User does not exist.', 404);
    }

    const resetToken = user.createPasswordChangeToken();
    await user.save();

    const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #333;">Ecommerce Store Password Reset Request</h2>
      <p>Please click the link below to reset your password. This link will expire in 15 minutes.</p>
      <a href="${process.env.URL_SERVER}/api/user/reset-password/${resetToken}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; font-size: 16px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>If you did not request a password reset, please ignore this email.</p>
    </div>
    `;

    const result = await sendMail(email, html);
    if (result && result.accepted && result.accepted.length > 0) {
      return buildResponseMessage(res, 'Send mail for reset password successfully.', 200);
    } else {
      return buildResponseMessage(res, 'Failed to send reset password email.', 500);
    }
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Request forgot password failed.';
    next(error);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { resetToken } = req.params;
    const { newPassword } = req.body;

    const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const user = await UserModel.findOne({
      where: {
        passwordResetToken,
        passwordResetTokenExpires: {
          [Op.gt]: Date.now(),
          [Op.not]: null
        }
      }
    });

    if (!user) {
      return buildResponseMessage(res, 'User does not exist or resetToken is expire.', 404);
    }

    user.password = newPassword;
    user.passwordResetToken = null; //  2 thường này không set về null làm sao để set về null torng database
    user.passwordResetTokenExpires = null; //
    user.passwordChangedAt = Date.now();
    await user.save();
    return buildSuccessResponse(res, 'Password reset successfully.', 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Request reset password failed.';
    next(error);
  }
}

module.exports = {
  signUp,
  login,
  refreshToken,
  forgotPassword,
  resetPassword
};
