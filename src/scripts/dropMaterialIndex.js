const mongoose = require('mongoose');

async function dropMaterialIndex() {
    try {
        await mongoose.connect('mongodb://localhost:27017/product_management');
        console.log('Connected to MongoDB');
        
        // Get the Material collection
        const db = mongoose.connection.db;
        const collection = db.collection('materials');
        
        // Drop the material_id index
        await collection.dropIndex('material_id_1');
        console.log('Successfully dropped material_id index');
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

dropMaterialIndex();
