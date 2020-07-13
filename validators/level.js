const Joi = require("@hapi/joi");

exports.levelCreateValidator = (req, res) => {
  console.log("Validator - LevelCreateValidator");

  const schema = Joi.object({
    level: Joi.string().required(),
  });

  return schema.validate(req);
};

exports.levelUpdateValidator = (req, res) => {
  console.log("Validator - LevelUpdateValidator");

  const schema = Joi.object({
    level: Joi.string().required(),
  });
};
