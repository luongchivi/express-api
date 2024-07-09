const Joi = require('joi');
const {
  createResultsSchemaResponse,
  createMessageSchemaResponse,
} = require('../shared');


const permissionName = Object.freeze({
  READ: 'read',
  WRITE: 'write',
  DELETE: 'delete',
  UPDATE: 'update',
});

const addPermissionReq = Joi.object({
  name: Joi.string().valid(...Object.values(permissionName)).required(),
  description: Joi.string(),
});

const addPermissionRes = createResultsSchemaResponse({
  permission: Joi.object().required(),
});

const permissionIdParam = Joi.object({
  permissionId: Joi.number().required(),
});

const getPermissionDetailsRes = createResultsSchemaResponse({
  permission: Joi.object().required(),
});

const getAllPermissionsRes = createResultsSchemaResponse({
  permissions: Joi.array().required(),
});

const deletePermissionRes = createMessageSchemaResponse();

module.exports = {
  addPermissionReq,
  addPermissionRes,
  getAllPermissionsRes,
  permissionIdParam,
  getPermissionDetailsRes,
  deletePermissionRes,
  permissionName,
};
