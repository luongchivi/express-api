const express = require('express');


const router = express.Router();
const {
  validateResponse,
  validateQuery,
} = require('../../middleware/validationHandler');
const {
  getAllProvinces,
} = require('./provinceController');
const {
  getAllProvincesRes,
  getAllProvincesQuery,
} = require('./provinceSchema');


// GET /api/v1/provinces
router.get(
  '/',
  validateQuery(getAllProvincesQuery),
  validateResponse(getAllProvincesRes),
  getAllProvinces,
);


module.exports = router;
