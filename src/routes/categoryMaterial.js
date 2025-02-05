const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Material = require('../models/Material');

// Get all categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all materials
router.get('/materials', async (req, res) => {
    try {
        const materials = await Material.find();
        res.json(materials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new category
router.post('/categories', async (req, res) => {
    try {
        if (!req.body.category_name) {
            return res.status(400).json({ message: 'category_name is required' });
        }

        const category = new Category({
            category_name: req.body.category_name
        });
        
        const newCategory = await category.save();
        res.status(201).json(newCategory);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Category name already exists' });
        }
        res.status(400).json({ message: error.message });
    }
});

// Add a new material
router.post('/materials', async (req, res) => {
    try {
        if (!req.body.material_name) {
            return res.status(400).json({ message: 'material_name is required' });
        }

        const material = new Material({
            material_name: req.body.material_name
        });
        
        const newMaterial = await material.save();
        res.status(201).json(newMaterial);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Material name already exists' });
        }
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
