const Joi = require("@hapi/joi");

const updateOne = Joi.object().keys({
  name: Joi.string().optional(),
  phone: Joi.string().optional(),
  shippingPrice: Joi.number().optional(),
  imageUrl: Joi.string().optional(),

  schedule: Joi.string().allow("").optional(),
  description: Joi.string().allow("").optional(),
  address: Joi.string().allow("").optional(),
  facebook: Joi.string().allow("").optional(),
  instagram: Joi.string().allow("").optional(),
  twitter: Joi.string().allow("").optional(),
});

module.exports = {
  updateOne,
};
