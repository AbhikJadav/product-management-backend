const mongoose = require('mongoose');

async function dropCategoryIndex() {
    try {
        await mongoose.connect('mongodb://localhost:27017/product_management');
        console.log('Connected to MongoDB');
        
        // Get the Category collection
        const db = mongoose.connection.db;
        const collection = db.collection('categories');
        
        // Drop the category_id index
        await collection.dropIndex('category_id_1');
        console.log('Successfully dropped category_id index');
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

dropCategoryIndex();
