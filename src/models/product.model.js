const mongoose = require('mongoose');
const CryptoJS = require('crypto-js');

const productSchema = new mongoose.Schema({
  SKU: {
    type: String,
    required: true,
    unique: true,
    set: value => CryptoJS.AES.encrypt(value, process.env.CRYPTO_SECRET || 'secret-key').toString(),
    get: value => {
      try {
        const bytes = CryptoJS.AES.decrypt(value, process.env.CRYPTO_SECRET || 'secret-key');
        return bytes.toString(CryptoJS.enc.Utf8);
      } catch (error) {
        return value;
      }
    }
  },
  product_name: {
    type: String,
    required: true
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  material_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material'
  }],
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true,
  toJSON: { getters: true }
});

const materialSchema = new mongoose.Schema({
  material_name: {
    type: String,
    required: true
  }
});

const categorySchema = new mongoose.Schema({
  category_name: {
    type: String,
    required: true
  }
});

const productMediaSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  url: {
    type: String,
    required: true
  }
});

const Product = mongoose.model('Product', productSchema);
const Material = mongoose.model('Material', materialSchema);
const Category = mongoose.model('Category', categorySchema);
const ProductMedia = mongoose.model('ProductMedia', productMediaSchema);

module.exports = {
  Product,
  Material,
  Category,
  ProductMedia
};
