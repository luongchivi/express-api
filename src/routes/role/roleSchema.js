const Joi = require('joi');
const {
  createResultsSchemaResponse,
  createMessageSchemaResponse,
} = require('../shared');


const createRoleReq = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
});

const createRoleRes = Joi.object({
  statusCode: Joi.number().required(),
  message: Joi.string().required(),
  role: Joi.object().required(),
});

const roleIdParam = Joi.object({
  roleId: Joi.number().required(),
});

const getRoleDetailsRes = createResultsSchemaResponse({
  role: Joi.object().required(),
});

const deleteRoleRes = createMessageSchemaResponse();

const getAllRolesRes = createResultsSchemaResponse({
  roles: Joi.array().required(),
});

const assignPermissionReq = Joi.object({
  permissionName: Joi.string().required(),
});

const assignPermissionRes = createMessageSchemaResponse();

const deletePermissionAssignReq = Joi.object({
  permissionName: Joi.string().required(),
});

const deletePermissionAssignRes = createMessageSchemaResponse();

module.exports = {
  createRoleReq,
  createRoleRes,
  roleIdParam,
  getRoleDetailsRes,
  deleteRoleRes,
  getAllRolesRes,
  assignPermissionReq,
  assignPermissionRes,
  deletePermissionAssignReq,
  deletePermissionAssignRes,
};
