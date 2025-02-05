const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    category_name: {
        type: String,
        required: true,
        unique: true // Make category name unique
    }
}, {
    timestamps: true,
    toJSON: { 
        transform: function(doc, ret) {
            ret.category_id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    }
});

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
module.exports = Category;
