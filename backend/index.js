import 'dotenv/config';
import app from './src/app.js';

import { authenticate, sequelize } from './src/config/db.js';

const PORT = process.env.PORT || 3000

const start = async () => {
    try {
        await authenticate();
        sequelize.sync({ force: false })

        app.listen(PORT, () => console.log(`Server run on ${PORT}`))
    } catch (e) {
        console.error('Error starting the server: ', e);
    }
}

start();