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
const provinceRouter = require('./province/provinceRoute');
const wardRouter = require('./ward/wardRoute');
const districtRouter = require('./district/districtRoute');


function routes(app) {
  if (!app) {
    console.error('App is not found');
    return;
  }

  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/roles', rolesRouter);
  app.use('/api/v1/categories', categoryRouter);
  app.use('/api/v1/suppliers', supplierRouter);
  app.use('/api/v1/products', productRouter);
  app.use('/api/v1/coupons', couponRouter);
  app.use('/api/v1/permissions', permissionRouter);
  app.use('/api/v1/address', addressRouter);
  app.use('/api/v1/cart', cartRouter);
  app.use('/api/v1/orders', orderRouter);
  app.use('/api/v1/provinces', provinceRouter);
  app.use('/api/v1/districts', districtRouter);
  app.use('/api/v1/wards', wardRouter);

  return app;
}

module.exports = routes;
