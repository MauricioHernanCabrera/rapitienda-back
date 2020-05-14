const Joi = require("@hapi/joi");
const BaseSchema = require("./base");

const createOne = Joi.object().keys({
  store: BaseSchema.id.required(),
  name: Joi.string().required(),
  category: BaseSchema.id.required(),
  imageUrl: Joi.string().allow("").required(),
  price: Joi.number().required(),
  description: Joi.string().allow("").required(),
});

const updateOne = Joi.object().keys({
  name: Joi.string().optional(),
  category: BaseSchema.id.optional(),
  imageUrl: Joi.string().allow("").optional(),
  price: Joi.number().optional(),
  description: Joi.string().allow("").optional(),
});

module.exports = {
  createOne,
  updateOne,
};
