const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const productRoutes = require('./routes/product.routes');
const categoryMaterialRoutes = require('./routes/categoryMaterial');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api', categoryMaterialRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
