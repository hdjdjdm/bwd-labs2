import 'module-alias/register.js';
import config from './src/config/config.js';
import app from './src/app.js';

import { authenticate, sequelize } from './src/config/db.js';

const start = async () => {
    try {
        await authenticate();
        sequelize.sync({ force: false });

        app.listen(config.db.port, () =>
            console.log(`Server run on ${config.db.port}`),
        );
    } catch (e) {
        console.error('Error starting the server: ', e);
    }
};

start();
