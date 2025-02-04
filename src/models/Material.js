const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    material_id: {
        type: Number,
        required: true,
        unique: true
    },
    material_name: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Material = mongoose.models.Material || mongoose.model('Material', materialSchema);
module.exports = Material;
