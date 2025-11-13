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
const orderRoutes = require('./routes/orderRoutes');
const adminUserRoutes = require('./routes/adminUserRoutes');
const adminDashboardRoutes = require('./routes/adminDashboardRoutes');
const adminCategoryRoutes = require('./routes/adminCategoryRoutes');
const adminSubcategoryRoutes = require('./routes/adminSubcategoryRoutes');
const adminProductRoutes = require('./routes/adminProductRoutes');
const adminOrderRoutes = require('./routes/adminOrderRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');

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
app.use('/api', orderRoutes)
app.use('/api', adminAuthRoutes);
app.use('/api', adminUserRoutes);
app.use('/api', adminDashboardRoutes);
app.use('/api', adminCategoryRoutes);
app.use('/api', adminSubcategoryRoutes);
app.use('/api', adminProductRoutes);
app.use('/api', adminOrderRoutes);

app.use("/uploads", express.static("uploads"));


// const path = require("path");
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

module.exports = app;
