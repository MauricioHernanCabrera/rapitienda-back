const Joi = require("@hapi/joi");

const createOne = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string().required(),
  videoLink: Joi.string().required(),
});

const updateOne = Joi.object().keys({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  videoLink: Joi.string().optional(),
});

module.exports = {
  createOne,
  updateOne,
};
