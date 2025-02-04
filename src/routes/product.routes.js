const express = require('express');
const router = express.Router();
const { Product, ProductMedia } = require('../models/product.model');
const productValidation = require('../validations/product.validation');

// Validation middleware
const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
};

// List products with filters and pagination
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, SKU, product_name, category_id, material_ids, status } = req.query;
    
    const query = {};
    if (SKU) query.SKU = { $regex: SKU, $options: 'i' };
    if (product_name) query.product_name = { $regex: product_name, $options: 'i' };
    if (category_id) query.category_id = category_id;
    if (material_ids) query.material_ids = { $in: material_ids.split(',') };
    if (status) query.status = status;

    const products = await Product.find(query)
      .populate('category_id')
      .populate('material_ids')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.status(200).json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create product
router.post('/', validate(productValidation.create), async (req, res) => {
  try {
    const existingSKU = await Product.findOne({ SKU: req.body.SKU });
    if (existingSKU) {
      return res.status(400).json({ error: 'Duplicate SKU not allowed' });
    }

    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product
router.put('/:id', validate(productValidation.update), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await ProductMedia.deleteMany({ product_id: req.params.id });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get statistics
router.get('/statistics', async (req, res) => {
  try {
    // Category wise highest price
    const categoryHighestPrice = await Product.aggregate([
      {
        $group: {
          _id: '$category_id',
          highestPrice: { $max: '$price' }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category'
        }
      }
    ]);

    // Price range wise product count
    const priceRangeCount = await Product.aggregate([
      {
        $facet: {
          '0-500': [
            { $match: { price: { $gte: 0, $lte: 500 } } },
            { $count: 'count' }
          ],
          '501-1000': [
            { $match: { price: { $gt: 500, $lte: 1000 } } },
            { $count: 'count' }
          ],
          '1000+': [
            { $match: { price: { $gt: 1000 } } },
            { $count: 'count' }
          ]
        }
      }
    ]);

    // Products with no media
    const productsWithNoMedia = await Product.aggregate([
      {
        $lookup: {
          from: 'productmedias',
          localField: '_id',
          foreignField: 'product_id',
          as: 'media'
        }
      },
      {
        $match: {
          media: { $size: 0 }
        }
      }
    ]);

    res.status(200).json({
      categoryHighestPrice,
      priceRangeCount: priceRangeCount[0],
      productsWithNoMedia
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
