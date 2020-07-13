const Joi = require("@hapi/joi");

exports.typeCreateValidator = (req, res) => {
  console.log("Validator - TypeCreateValidator");

  const schema = Joi.object({
    type: Joi.string().required(),
  });

  return schema.validate(req);
};

exports.typeUpdateValidator = (req, res) => {
  console.log("Validator - TypeUpdateValidator");

  const schema = Joi.object({
    type: Joi.string().required(),
  });
};
