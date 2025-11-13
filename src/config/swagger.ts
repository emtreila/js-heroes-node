import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Comedian Catalog API',
      version: '1.0.0',
      description: 'A RESTful API for managing a comedian catalog',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/server.ts'], // Path to the API files
};

export const swaggerSpec = swaggerJsdoc(options);
