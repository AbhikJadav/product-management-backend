const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/product_management';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Create indexes for better query performance
    const db = mongoose.connection;
    await db.collection('products').createIndex({ SKU: 1 }, { unique: true });
    await db.collection('products').createIndex({ product_name: 1 });
    await db.collection('products').createIndex({ category_id: 1 });
    await db.collection('products').createIndex({ status: 1 });
    
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
