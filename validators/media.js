const Joi = require("@hapi/joi");

exports.mediaCreateValidator = (req, res) => {
  console.log("Validator - MediaCreateValidator");

  const schema = Joi.object({
    media: Joi.string().required(),
  });

  return schema.validate(req);
};

exports.mediaUpdateValidator = (req, res) => {
  console.log("Validator - MediaUpdateValidator");

  const schema = Joi.object({
    media: Joi.string().required(),
  });

  return schema.validate(req);
};
