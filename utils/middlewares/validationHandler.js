const Joi = require("@hapi/joi");
const boom = require("@hapi/boom");

const validate = (data, schema) => {
  const { error } = Joi.validate(data, schema);
  return error;
};

const validationMiddleware = (schema, check = "body") => (req, res, next) => {
  const error = validate(req[check], schema);
  error ? next(boom.badRequest(error)) : next();
};

const validationFunction = (schema, check) =>
  new Promise((res, rej) => {
    const error = validate(check, schema);
    error ? rej(boom.badRequest(error)) : res();
  });

module.exports = {
  validationMiddleware,
  validationFunction,
};
