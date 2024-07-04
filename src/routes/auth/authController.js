const UserModel  = require("../../database/models/user");
const UserRoleModel  = require("../../database/models/userRole");
const RoleModel  = require("../../database/models/role");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateFreshToken } = require("../../middleware/authHandler");
const jwt = require("jsonwebtoken");
const { buildResponseMessage, buildSuccessResponse } = require('../shared');

async function signUp(req, res, next){
  try {
    const { password } = req.body;

    const passwordEncode = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      ...req.body,
      password: passwordEncode,
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

    const { id, email } = newUser;
    const { password: _, deletedAt, ...rest } = newUser.dataValues;

    const accessToken = generateAccessToken({ userId: id, email });
    const refreshToken = generateFreshToken({ userId: id, email });

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

async function login(req, res, next){
  try {
    const { email, password } = req.body;
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

    const accessToken = generateAccessToken({ userId: user.id, email });
    const refreshToken = generateFreshToken({ userId: user.id, email });

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

async function refreshToken(req, res, next){
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return buildResponseMessage(res, 'Refresh token is missing.', 401);
    }

    const refreshTokenDecoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);
    const { userId, email } = refreshTokenDecoded;

    const newAccessToken = generateAccessToken({ userId, email });

    return buildSuccessResponse(res, 'Generate new accessToken successfully.', {
      accessToken: newAccessToken,
    }, 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Generate refreshToken failed.';
    next(error);
  }
}

module.exports = {
  signUp,
  login,
  refreshToken,
};
