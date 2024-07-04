require('dotenv').config({path: `${process.cwd()}/.env`});

module.exports = (req, res, next) => {
  req.query.pageSize = req.query.pageSize || process.env.PAGE_SIZE;
  req.query.page = req.query.page || process.env.PAGE;
  req.query.sortBy = req.query.sortBy || process.env.SORT_BY;
  req.query.sortOrder = req.query.sortOrder || process.env.SORT_ORDER;
  next();
};
