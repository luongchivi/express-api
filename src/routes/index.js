const authRouter = require('./auth/authRoute');
const userRouter = require('./user/userRoute');
const rolesRouter = require('./role/roleRoute');
const addressRouter = require('./address/addressRoute');
const permissionRouter = require('./permission/permissionRoute');
const categoryRouter = require('./category/categoryRoute');
const supplierRouter = require('./supplier/supplierRoute');
const productRouter = require('./product/productRoute');
const couponRouter = require('./coupon/couponRoute');
const cartRouter = require('./cart/cartRoute');
const orderRouter = require('./order/orderRoute');
const { verifyToken } = require('../middleware/authHandler');


function routes(app) {
  if (!app) {
    console.error('App is not found');
    return;
  }

  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/users', verifyToken, userRouter);
  app.use('/api/v1/roles', verifyToken, rolesRouter);
  app.use('/api/v1/categories', verifyToken, categoryRouter);
  app.use('/api/v1/suppliers', verifyToken, supplierRouter);
  app.use('/api/v1/products', verifyToken, productRouter);
  app.use('/api/v1/coupons', verifyToken, couponRouter);
  app.use('/api/v1/permissions', verifyToken, permissionRouter);
  app.use('/api/v1/address', verifyToken, addressRouter);
  app.use('/api/v1/cart', verifyToken, cartRouter);
  app.use('/api/v1/orders', verifyToken, orderRouter);

  return app;
}

module.exports = routes;
