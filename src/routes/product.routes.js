const express = require('express');
const router = express.Router();
const { Product, Category } = require('../models');
const productValidation = require('../validations/product.validation');

// Validation middleware
const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: error.details[0].message });
  }
};

// Create a new product
router.post('/', validate(productValidation.create), async (req, res) => {
  try {
    // Check for duplicate SKU
    const existingProduct = await Product.findOne({ SKU: req.body.SKU });
    if (existingProduct) {
      return res.status(400).json({ error: 'Duplicate SKU not allowed' });
    }

    const product = new Product(req.body);
    await product.save();
    
    // Populate and return the saved product
    const populatedProduct = await Product.findById(product._id)
      .populate({
        path: 'category_id',
        select: '_id category_name'
      })
      .populate('material_ids');
      
    res.status(201).json(populatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a product
router.put('/:id', validate(productValidation.update), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    .populate({
      path: 'category_id',
      select: '_id category_name'
    })
    .populate('material_ids');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query;
    const query = {};

    if (filters.SKU) {
      query.SKU = { $regex: filters.SKU, $options: 'i' };
    }
    if (filters.product_name) {
      query.product_name = { $regex: filters.product_name, $options: 'i' };
    }
    if (filters.category_id) {
      query.category_id = filters.category_id;
    }
    if (filters.material_ids) {
      query.material_ids = { $in: filters.material_ids.split(',') };
    }
    if (filters.status) {
      query.status = filters.status;
    }

    const products = await Product.find(query)
      .populate({
        path: 'category_id',
        select: '_id category_name'
      })
      .populate('material_ids')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Transform the response to include both category_id and category_name and decrypted SKU
    const transformedProducts = products.map(product => {
      const plainProduct = product.toObject({ getters: true }); 
      if (plainProduct.category_id) {
        const { category_id } = plainProduct;
        return {
          ...plainProduct,
          category_id: {
            category_id: category_id._id,
            category_name: category_id.category_name
          }
        };
      }
      return plainProduct;
    });

    const totalProducts = await Product.countDocuments(query);

    res.json({
      products: transformedProducts,
      totalProducts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalProducts / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get product statistics
router.get('/statistics', async (req, res) => {
  try {
    // Get all products with populated category and material information
    const products = await Product.find()
      .populate({
        path: 'category_id',
        select: '_id category_name'
      })
      .populate('material_ids');

    // Calculate statistics
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.status === 'active').length;
    const totalValue = products.reduce((sum, product) => sum + (product.price || 0), 0);

    // Get products without media
    const productsWithNoMedia = await Product.find({
      $or: [
        { media_url: { $exists: false } },
        { media_url: null },
        { media_url: '' }
      ]
    })
    .populate({
      path: 'category_id',
      select: '_id category_name'
    })
    .select('_id SKU product_name category_id');

    const result = await Promise.all([
      // Get categories with non-zero highest prices
      Category.aggregate([
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: 'category_id',
            as: 'products'
          }
        },
        {
          $project: {
            _id: 1,
            category: [{
              category_name: '$category_name'
            }],
            highestPrice: {
              $max: '$products.price'
            },
            productCount: {
              $size: {
                $filter: {
                  input: '$products',
                  as: 'product',
                  cond: { $gt: ['$$product.price', 0] }
                }
              }
            }
          }
        },
        {
          $match: {
            highestPrice: { $gt: 0 },
            productCount: { $gt: 0 }
          }
        },
        { $sort: { highestPrice: -1 } }
      ]),
      Product.aggregate([
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
      ])
    ]);

    res.json({
      totalProducts,
      activeProducts,
      totalValue,
      categoryHighestPrice: result[0],
      priceRangeCount: result[1][0],
      productsWithNoMedia
    });
  } catch (error) {
    console.error('Statistics Error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
