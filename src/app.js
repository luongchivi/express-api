require('dotenv').config({ path: `${process.cwd()}/.env` });
const express = require('express');
const morgan = require('morgan');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const paginationDefaults = require('./middleware/paginationDefaults');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const yaml = require('js-yaml');
const printRoutes = require('./middleware/printRoutes');
const { buildResponseMessage } = require('./routes/shared');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { registerCronJobs } = require('./lib/cronManager');


let app = express();
const PORT = process.env.APP_PORT || 4000;

// Plugin cornManager
registerCronJobs();

// Cors config
app.use(cors({
  origin: process.env.URL_SERVER_FE,
  methods: ['*'],
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

// Apply pagination defaults middleware globally
app.use(paginationDefaults);

// Route init
app = routes(app);

// Print routes to console
printRoutes(app._router);

// Load Swagger YAML file
const swaggerDocument = yaml.load(fs.readFileSync('./docs/swagger.yaml', 'utf8'));

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('*', (req, res, _next) => {
  return buildResponseMessage(res,'Resource Not Found.', 404);
});

// Error handler middleware
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server up and running at http://localhost:${PORT}`));
