import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import passport from './config/passport.js';
import routes from './routes/index.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swaggerConfig.js';
import errorMiddleware from './middleware/errorMiddleware.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use(passport.initialize());

app.use(morgan('[:method] :url'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', routes)

app.use(errorMiddleware);

export default app;