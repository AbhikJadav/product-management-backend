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
  },
  media_url: {
    type: String,
    required: false,
    default: ''
  }
}, {
  timestamps: true,
  toJSON: { getters: true }
});

const Product = mongoose.model('Product', productSchema);

module.exports = {
  Product
};
