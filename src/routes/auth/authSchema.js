const Joi = require('joi');
const {
  createResultsSchemaResponse,
  createMessageSchemaResponse
} = require('../shared');

const signUpReq = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const signUpRes = createResultsSchemaResponse({
  user: Joi.object().required(),
  accessToken: Joi.string().required(),
  refreshToken: Joi.string().required(),
});

const loginReq = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const loginRes = createResultsSchemaResponse({
  accessToken: Joi.string().required(),
  refreshToken: Joi.string().required(),
});

const refreshTokenReq = Joi.object({
  refreshToken: Joi.string().not(null).required(),
});

const refreshTokenRes = createResultsSchemaResponse({
  accessToken: Joi.string().required(),
});

const forgotPasswordReq = Joi.object({
  email: Joi.string().required(),
});

const forgotPasswordRes = createMessageSchemaResponse();

const resetPasswordReq = Joi.object({
  newPassword: Joi.string().required(),
});

const resetPasswordRes = createMessageSchemaResponse();

const resetPasswordParam = Joi.object({
  resetToken : Joi.string().required(),
});

module.exports = {
  signUpReq,
  signUpRes,
  loginReq,
  loginRes,
  refreshTokenReq,
  refreshTokenRes,
  forgotPasswordReq,
  forgotPasswordRes,
  resetPasswordReq,
  resetPasswordRes,
  resetPasswordParam
}



