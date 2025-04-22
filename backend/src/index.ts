import config from '@config/config.js';
import app from './app.js';
import { authenticate, sequelize } from '@config/db.js';
import { setupAssociations } from '@models/associations.js';

async function start() {
    try {
        await authenticate();
        await setupAssociations();
        await sequelize.sync({ force: false });

        app.listen(config.server.port, (): void => console.log(`Сервер запущен на порте ${config.server.port}`));
    } catch (e: unknown) {
        console.error('Ошибка запуска сервера: ', e);
    }
}

start();
