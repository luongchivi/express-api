const Joi = require('joi');
const {
  createResultsSchemaResponse,
  createMessageSchemaResponse,
  createSchemaQuery,
  createListResultsSchemaResponse,
} = require('../shared');


const idParam = Joi.object({
  id: Joi.number().required(),
});

const getUserDetailsRes = createResultsSchemaResponse({
  user: Joi.object().required(),
});

const getAllUsersRes = createListResultsSchemaResponse({
  users: Joi.array().required(),
});

const updateUserReq = Joi.object({
  firstName: Joi.string().max(50).optional(),
  lastName: Joi.string().optional(),
  email: Joi.string().optional(),
  address: Joi.string().optional(),
  districtId: Joi.string().optional(),
  wardId: Joi.string().optional(),
  provinceId: Joi.string().optional(),
  phone: Joi.string().optional(),
});

const updateUserRes = createResultsSchemaResponse({
  user: Joi.object().required(),
});

const assignRoleReq = Joi.object({
  roleName: Joi.string().required(),
});

const assignRoleRes = createMessageSchemaResponse();

const softDeleteUserRes = createMessageSchemaResponse();

const deleteRoleAssignReq = Joi.object({
  roleName: Joi.string().required(),
});

const deleteRoleAssignRes = createMessageSchemaResponse();

const getAllUsersQuery = createSchemaQuery({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  isActive: Joi.boolean().optional(),
  createdAt: Joi.string().optional(),
});

const getCurrentUserRes = createResultsSchemaResponse({
  user: Joi.object().required(),
});

module.exports = {
  idParam,
  getUserDetailsRes,
  getAllUsersRes,
  updateUserReq,
  updateUserRes,
  assignRoleReq,
  assignRoleRes,
  softDeleteUserRes,
  deleteRoleAssignReq,
  deleteRoleAssignRes,
  getAllUsersQuery,
  getCurrentUserRes,
};
