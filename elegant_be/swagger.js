// swagger.js
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Elegant BE API',
    description: 'Swagger documentation for Elegant BE APIs',
    version: '1.0.0',
  },
  host: 'localhost:8080',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js']; // Your main file with routes

swaggerAutogen(outputFile, endpointsFiles, doc);
