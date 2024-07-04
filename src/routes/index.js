const authRouter = require('./auth/authRoute');
const userRouter = require('./user/userRoute');
const rolesRouter = require('./role/roleRoute');
const addressRouter = require('./address/addressRoute');
const permissionRouter = require('./permission/permissionRoute');
const { verifyToken } = require('../middleware/authHandler');

function routes(app) {
  if (!app) {
    console.error('App is not found');
    return;
  }

  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/users', verifyToken, userRouter);
  app.use('/api/v1/roles', verifyToken, rolesRouter);
  app.use('/api/v1/permissions', verifyToken, permissionRouter);
  app.use('/api/v1/address', verifyToken, addressRouter);

  return app;
}

module.exports = routes;
