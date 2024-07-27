require('dotenv').config({ path: `${process.cwd()}/.env` });
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize');
const uniqid = require('uniqid');
const UserModel = require('../../database/models/user');
const UserRoleModel = require('../../database/models/userRole');
const RoleModel = require('../../database/models/role');
const {
  generateAccessToken,
  generateFreshToken,
} = require('../../middleware/authHandler');
const {
  buildResponseMessage,
  buildSuccessResponse,
} = require('../shared');
const EmailService = require('../../lib/EmailService');


async function signUp(req, res, next) {
  try {
    const newUser = await UserModel.create({
      ...req.body,
    });

    const userRole = await RoleModel.findOne({
      where: {
        name: 'User',
      },
    });

    if (!userRole) {
      return buildResponseMessage(res, 'User role not found', 404);
    }

    await UserRoleModel.create({
      userId: newUser.id,
      roleId: userRole.id,
    });

    const { id, email } = newUser;

    const accessToken = generateAccessToken({
      userId: id,
      email,
    });
    const refreshToken = generateFreshToken({
      userId: id,
      email,
    });
    await newUser.update({ refreshToken });
    await newUser.reload();

    const verifyEmailToken = uniqid();

    // Send email for verify email signup
    const emailService = new EmailService();
    const result = await emailService.sendMail('verifyEmail', { email, verifyEmailToken });
    if (!result.accepted && result.accepted.length !== 0) {
      return buildResponseMessage(res, 'Failed to send email to verify.', 400);
    }

    // save verifyEmailToken for later check in /api/v1/auth/verify-email/{verifyEmailToken}
    newUser.verifyEmailToken = verifyEmailToken;
    newUser.verifyEmailTokenExpires = Date.now() + parseInt(process.env.VERIFY_EMAIL_TOKEN_EXPIRES, 10);
    await newUser.save();
    await newUser.reload();

    const {
      password: _password,
      deletedAt: _deleteAt,
      isActive: _isActive,
      refreshToken: _refreshToken,
      passwordResetToken: _passwordResetToken,
      passwordResetTokenExpires: _passwordResetTokenExpires,
      passwordChangedAt: _passwordChangedAt,
      hasVerifiedEmail: _hasVerifiedEmail,
      verifyEmailToken: _verifyEmailToken,
      verifyEmailTokenExpires: _verifyEmailTokenExpires,
      ...rest
    } = newUser.dataValues;

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

async function verifyEmail(req, res, next) {
  try {
    const { verifyEmailToken } = req.params;

    const user = await UserModel.findOne({
      where: {
        verifyEmailToken,
        verifyEmailTokenExpires: {
          [Op.gt]: new Date(), // Check that the token has not expired
          [Op.not]: null,
        },
      },
    });

    // Check if user exists and token is valid
    if (!user) {
      return buildResponseMessage(res, 'Invalid or expired verification token.', 400);
    }

    // Check if the email is already verified
    if (user.hasVerifiedEmail) {
      return buildResponseMessage(res, 'Email already verified.', 400);
    }

    // Update the user's verification status
    user.hasVerifiedEmail = true;
    user.verifyEmailToken = null;
    user.verifyEmailTokenExpires = null;
    user.isActive = true;
    await user.save();

    return res.redirect(`${process.env.URL_SERVER_FE}/login`);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to verify email.';
    next(error);
  }
}

async function resendVerifyEmail(req, res, next) {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({
      where: {
        email,
        isActive: false,
        hasVerifiedEmail: false,
      },
    });

    if (!user) {
      return buildResponseMessage(res, 'User not found.', 404);
    }

    const { verifyEmailToken } = user;

    // Resend email to verify
    const emailService = new EmailService();
    const result = await emailService.sendMail('verifyEmail', { email, verifyEmailToken });
    if (!result.accepted && result.accepted.length !== 0) {
      return buildResponseMessage(res, 'Failed to send email to verify.', 400);
    }
    return buildResponseMessage(res, 'Resend verification successfully.', 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to resend verify email.';
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({
      where: { email },
    });

    if (!user) {
      return buildResponseMessage(res, 'User does not exist.', 404);
    }

    // Check if the user's email is verified
    if (!user.hasVerifiedEmail || !user.isActive) {
      return buildResponseMessage(res, 'Email not verified. Please verify your email before logging in.', 401);
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return buildResponseMessage(res, 'Username or password is incorrect.', 401);
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      email,
    });
    const refreshToken = generateFreshToken({
      userId: user.id,
      email,
    });

    // save refreshToken into database
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie(
      'refreshToken',
      refreshToken,
      {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 1000,
      },
    );

    const {
      password: _password,
      passwordResetToken: _passwordResetToken,
      passwordResetTokenExpires: _passwordResetTokenExpires,
      passwordChangedAt: _passwordChangedAt,
      deletedAt: _deletedAt,
      refreshToken: _refreshToken,
      ...rest
    } = user.dataValues;

    return buildSuccessResponse(res, 'Login successfully.', {
      accessToken,
      refreshToken,
      user: rest,
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
      email,
    } = refreshTokenDecoded;

    const newAccessToken = generateAccessToken({
      userId,
      email,
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
        email,
      },
    });

    if (!user) {
      return buildResponseMessage(res, 'User does not exist.', 404);
    }

    const resetToken = user.createPasswordChangeToken();
    await user.save();

    const emailService = new EmailService();
    const result = await emailService.sendMail('forgotPassword', { email, resetToken });
    if (!result.accepted && !result.accepted.length > 0) {
      return buildResponseMessage(res, 'Failed to send reset password email.', 500);
    }
    return buildResponseMessage(res, 'Send mail for reset password successfully.', 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Request forgot password failed.';
    next(error);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { newPassword, resetToken } = req.body;

    const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const user = await UserModel.findOne({
      where: {
        passwordResetToken,
        passwordResetTokenExpires: {
          [Op.gt]: Date.now(),
          [Op.not]: null,
        },
      },
    });

    if (!user) {
      return buildResponseMessage(res, 'Request link for reset password expires.', 400);
    }

    user.password = newPassword;
    user.passwordResetToken = null;
    user.passwordResetTokenExpires = null;
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
  verifyEmail,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  resendVerifyEmail,
};
