import config from './config/config';
import app from './app';

import { authenticate, sequelize } from './config/db';

const start: () => Promise<void> = async (): Promise<void> => {
    try {
                await authenticate();

        a   wait sequelize.sync({ force: false });

                            app.listen(config.server.port, (): void => console.log(`Server run on ${config.server.port}`));
    }       catch (e: unknown) {
        console.error('Error starting the server: ', e);
    }
};

start();
