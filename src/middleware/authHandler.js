require('dotenv').config({path: `${process.cwd()}/.env`});
const UserModel = require('../database/models/user');
const RoleModel = require('../database/models/role');
const PermissionModel = require('../database/models/permission');
const jwt = require("jsonwebtoken");
const { buildResponseMessage, buildErrorResponse } = require('../routes/shared');
const UserRoleModel = require('../database/models/userRole');
const RolePermissionModel = require('../database/models/rolePermission');


function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES,
  })
}

function generateFreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES,
  })
}

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return buildResponseMessage(res, 'Token is missing.', 401);
    }

    const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);

    const { userId, email } = decodedToken;

    if (!userId || !email) {
      return buildResponseMessage(res, 'Invalid Token.', 403);
    }

    req.userInfo = { userId, email };

    const validUser = await UserModel.findOne({
      where: {
        id: userId,
        email,
      }
    })

    if (!validUser) {
      return buildResponseMessage(res, 'Invalid Token.', 403);
    }

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return buildResponseMessage(res, 'Invalid Token.', 403);
    } else if (error.name === 'TokenExpiredError') {
      return buildResponseMessage(res, 'Token Expired.', 401);
    }
    return buildErrorResponse(res, 'Internal Server Error.', { errorMessage: error.message }, 500);
  }
};

const verifyPermission = (permissionName) => {
  return async (req, res, next) => {
    try {
      const { userId, email } = req.userInfo;

      const user = await UserModel.findOne({
        where: {
          id: userId,
          email
        },
        attributes: {
          exclude: ['password', 'deletedAt']
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
          }
        }
      });

      if (!user) {
        return buildResponseMessage(res, 'User not found.', 404);
      }

      const getPermissions = [...new Set(user.roles.flatMap(role => role.permissions.map(permission => permission.name)))] ?? [];
      const hasPermission = getPermissions.includes(permissionName);

      if (!hasPermission) {
        return buildResponseMessage(res, 'Access Denied. Insufficient Permission.', 403);
      }

      next();
    } catch (error) {
      return buildErrorResponse(res, 'Internal Server Error.', {
        errorMessage: error,
      }, 500);
    }
  }
}

const verifyRole = (roleNames) => {
  return async (req, res, next) => {
    try {
      const { userId, email } = req.userInfo;

      const user = await UserModel.findOne({
        where: {
          id: userId,
          email
        },
        attributes: {
          exclude: ['password', 'deletedAt']
        },
        include: {
          model: RoleModel,
          as: 'roles',
          attributes: { exclude: [UserRoleModel] },
          through: { attributes: [] }
        }
      });

      if (!user) {
        return buildResponseMessage(res, 'User not found.', 404);
      }

      const getRoles = [...new Set(user.roles.map(role => role.name))] ?? [];
      const hasRole = roleNames.some(role => getRoles.includes(role));

      if (!hasRole) {
        return buildResponseMessage(res, 'Access Denied. Insufficient Role.', 403);
      }

      next();
    } catch (error) {
      return buildErrorResponse(res, 'Internal Server Error.', {
        errorMessage: error,
      }, 500);
    }
  }
}

module.exports = {
  generateAccessToken,
  generateFreshToken,
  verifyToken,
  verifyPermission,
  verifyRole
}

