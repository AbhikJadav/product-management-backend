const Joi = require('joi');

const productValidation = {
  create: Joi.object({
    SKU: Joi.string().required(),
    product_name: Joi.string().required(),
    category_id: Joi.string().required(),
    material_ids: Joi.array().items(Joi.string()).required(),
    price: Joi.number().required().min(0),
    status: Joi.string().valid('active', 'inactive')
  }),
  
  update: Joi.object({
    product_name: Joi.string(),
    category_id: Joi.string(),
    material_ids: Joi.array().items(Joi.string()),
    price: Joi.number().min(0),
    status: Joi.string().valid('active', 'inactive')
  }),

  queryParams: Joi.object({
    page: Joi.number().min(1),
    limit: Joi.number().min(1),
    SKU: Joi.string(),
    product_name: Joi.string(),
    category_id: Joi.string(),
    material_ids: Joi.string(),
    status: Joi.string().valid('active', 'inactive')
  })
};

module.exports = productValidation;
