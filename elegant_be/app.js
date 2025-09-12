const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const addressRoutes = require('./routes/addressRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const subcategoryRoutes = require('./routes/subcategoryRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const couponRoutes = require('./routes/couponRoutes');

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json'); 
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Middleware
app.use(express.json());
// Routes
app.use('/api', authRoutes); 
app.use('/api', userRoutes); 
app.use('/api', addressRoutes); 
app.use('/api', categoryRoutes); 
app.use('/api', subcategoryRoutes); 
app.use('/api', productRoutes); 
app.use('/api', cartRoutes )
app.use('/api', couponRoutes)

app.use("/uploads", express.static("uploads"));


// const path = require("path");
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

module.exports = app;
