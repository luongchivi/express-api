const express = require('express');


const router = express.Router();
const {
  validateResponse,
  validateQuery,
} = require('../../middleware/validationHandler');
const {
  getAllWards,
} = require('./wardController');
const {
  getAllWardsRes,
  getAllWardsQuery,
} = require('./wardSchema');


// GET /api/v1/wards
router.get(
  '/',
  validateQuery(getAllWardsQuery),
  validateResponse(getAllWardsRes),
  getAllWards,
);


module.exports = router;
