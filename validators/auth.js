const Joi = require("@hapi/joi");

exports.userSignupValidator = (req, res) => {
  console.log("Validator - UserSignupValidation");

  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(req);
};

exports.userSigninValidator = (req, res) => {
  console.log("Validator - UserSigninValidator");

  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(req);
};

exports.forgotPasswordValidator = (req, res) => {
  console.log("Validator - ForgotPasswordValidator");

  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
  });

  return schema.validate(req);
};

exports.resetPasswordValidator = (req, res) => {
  console.log("Validator - ResetPasswordValidator");

  const schema = Joi.object({
    newPassword: Joi.string().min(6).max(255).required(),
    resetPasswordLink: Joi.string().required(),
  });

  return schema.validate(req);
};

exports.userUpdateValidator = (req, res) => {
  console.log("Validator - UserUpdateValidator");

  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    password: Joi.string().allow(""),
  });

  return schema.validate(req);
};
