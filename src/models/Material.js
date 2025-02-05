const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    material_name: {
        type: String,
        required: true,
        unique: true // Make material name unique
    }
}, {
    timestamps: true,
    toJSON: { 
        transform: function(doc, ret) {
            ret.material_id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    }
});

const Material = mongoose.models.Material || mongoose.model('Material', materialSchema);
module.exports = Material;
