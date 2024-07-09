require('dotenv').config({ path: `${process.cwd()}/.env` });


const PORT = process.env.APP_PORT || 4000;

const printRoutes = (router, prefix = '', maxPathLength = 0) => {
  const routes = [];

  const cleanPath = path => path.replace(/\/+/g, '/'); // Loại bỏ dấu "//"

  const collectRoutes = (router, prefix = '') => {
    router.stack.forEach(middleware => {
      if (middleware.route) {
        const methods = Object.keys(middleware.route.methods).join(', ').toUpperCase();
        const path = cleanPath(prefix + middleware.route.path.replace(/\(\?\=\/\|\$\)/g, ''));
        routes.push({ methods, path });
      } else if (middleware.name === 'router' && middleware.handle.stack) {
        const newPrefix = cleanPath(prefix + (middleware.regexp.source === '^\\/?$' ? '' : middleware.regexp.source
          .replace(/\\\//g, '/')
          .replace(/\\\?\(\?:\^\(\?:\\\/\)\?\$/g, '') // Loại bỏ ?(?:^\(?:\/)?$
          .replace(/\^/, '')
          .replace(/\?\(\?=\/\|\$\)/g, '') // Loại bỏ ?(?=/|$)
          .replace(/\(\?:\^\/\|\$\)/g, '') // Loại bỏ (?:^/|$)
          .replace(/\(\?:\(\?:\/\)\?\$/g, '') // Loại bỏ (?:\(?:/)?
          .replace(/\(\?:\^\\\/\|\\\$\)/g, '') // Loại bỏ (?:^\/|$)
          .replace(/\(\?:\^\(\?:\/\)\?/, '') // Loại bỏ (?:^(?:/)
          .replace(/\(\?\:/g, '') // Loại bỏ (?:
          .replace(/\^\(\?:\//, '') // Loại bỏ ^(?:/
          .replace(/\?\(\?:\^\(/g, '') // Loại bỏ ?(?:^(
        ));
        collectRoutes(middleware.handle, newPrefix);
      }
    });
  };

  collectRoutes(router, prefix);

  // Tìm độ dài lớn nhất của các endpoint path để căn chỉnh format
  routes.forEach(route => {
    maxPathLength = Math.max(maxPathLength, route.path.length);
  });

  // In các route với format
  routes.forEach(route => {
    console.log(`${route.methods.padEnd(6)} ${route.path.padEnd(maxPathLength + 2)}`);
  });
  console.log(`API spec documents http://localhost:${PORT}/api-docs`);
};

module.exports = printRoutes;
