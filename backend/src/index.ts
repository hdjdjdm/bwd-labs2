import config from '@config/config.js';
import app from './app.js';
import { authenticate, sequelize } from '@config/db.js';

async function start() {
    try {
        await authenticate();

        await sequelize.sync({ force: false });

        app.listen(config.server.port, (): void => console.log(`Server run on ${config.server.port}`));
    } catch (e: unknown) {
        console.error('Error starting the server: ', e);
    }
}

start();
