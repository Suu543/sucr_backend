const express = require("express");
const router = express.Router();

// Validators
const validate = require("../middleware/validate");
const {
  typeCreateValidator,
  typeUpdateValidator,
} = require("../validators/type");

// Auth
const { requireSignin, adminMiddleware } = require("../controllers/auth");

// Controllers
const { create, read, update, remove } = require("../controllers/type");

// Routes
router.get("/types", read);
router.post(
  "/type",
  validate(typeCreateValidator),
  requireSignin,
  adminMiddleware,
  create
);
router.put(
  "/type/:id",
  validate(typeUpdateValidator),
  requireSignin,
  adminMiddleware,
  update
);
router.delete("/type/:id", requireSignin, adminMiddleware, remove);

module.exports = router;
