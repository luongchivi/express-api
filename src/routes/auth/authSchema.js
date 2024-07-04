const Joi = require('joi');
const { createResultsSchemaResponse } = require('../shared');

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

module.exports = {
  signUpReq,
  signUpRes,
  loginReq,
  loginRes,
  refreshTokenReq,
  refreshTokenRes
}



