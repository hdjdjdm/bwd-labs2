const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerConfig');

const app = express();

app.use(express.json());
app.use(cors());

app.use(morgan('[:method] :url'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', routes)

module.exports = app;