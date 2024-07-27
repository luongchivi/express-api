const Joi = require('joi');
const {
  createResultsSchemaResponse,
  createMessageSchemaResponse,
} = require('../shared');


const signUpReq = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
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
  user: Joi.object().required(),
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
  resetToken: Joi.string().required(),
  newPassword: Joi.string().required(),
});

const resetPasswordRes = createMessageSchemaResponse();

const verifyEmailParam = Joi.object({
  verifyEmailToken: Joi.string().required(),
});

const verifyEmailRes = createMessageSchemaResponse();

const resendVerifyEmailReq = Joi.object({
  email: Joi.string().required(),
});

const resendVerifyEmailRes = createMessageSchemaResponse();


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
  verifyEmailParam,
  verifyEmailRes,
  resendVerifyEmailReq,
  resendVerifyEmailRes,
};
