const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const addressRoutes = require('./routes/addressRoutes');

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json'); 
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Middleware
app.use(express.json());

// Routes
app.use('/api', authRoutes); 
app.use('/api', userRoutes); 
app.use('/api', addressRoutes); 

module.exports = app;
