require('dotenv').config();
const app = require('./src/app');
const { authenticate, sequelize } = require('./src/config/db');

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