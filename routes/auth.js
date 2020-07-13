const express = require("express");
const router = express.Router();

// import validators
const {
  userSignupValidator,
  userSigninValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../validators/auth");
const validate = require("../middleware/validate");

// import from controllers
const {
  register,
  activateRegistration,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");

router.post("/register", validate(userSignupValidator), register);
router.post("/register/activate", activateRegistration);
router.post("/login", validate(userSigninValidator), login);
router.put("/forgot-password", validate(forgotPasswordValidator), forgotPassword);
router.put("/reset-password", validate(resetPasswordValidator), resetPassword);

module.exports = router;
