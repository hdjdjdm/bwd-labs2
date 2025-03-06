import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'bwd-labs2',
            version: '1.0.0',
            description: 'Documentation about created API',
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Local server',
            },
        ],
    },
    apis: ['./src/routes/*.js'],
};

const swaggerSpec: object = swaggerJSDoc(options);
export default swaggerSpec;
