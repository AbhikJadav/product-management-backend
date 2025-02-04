const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Material = require('../models/Material');

// Get all categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find().select('category_id category_name -_id');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all materials
router.get('/materials', async (req, res) => {
    try {
        const materials = await Material.find().select('material_id material_name -_id');
        res.json(materials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new category
router.post('/categories', async (req, res) => {
    const category = new Category({
        category_id: req.body.category_id,
        category_name: req.body.category_name
    });

    try {
        const newCategory = await category.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Add a new material
router.post('/materials', async (req, res) => {
    const material = new Material({
        material_id: req.body.material_id,
        material_name: req.body.material_name
    });

    try {
        const newMaterial = await material.save();
        res.status(201).json(newMaterial);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
