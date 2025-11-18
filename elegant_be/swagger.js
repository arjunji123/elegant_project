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

// Only generate when explicitly called
if (require.main === module) {
  swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log('Swagger documentation generated successfully!');
  });
}

module.exports = { swaggerAutogen, doc, outputFile, endpointsFiles };
