const Joi = require("@hapi/joi");
const BaseSchema = require("./base");

const createOne = Joi.object().keys({
  name: Joi.string().required(),
  store: BaseSchema.id.required(),
});

const updateOne = Joi.object().keys({
  name: Joi.string().required(),
});

module.exports = {
  createOne,
  updateOne,
};
