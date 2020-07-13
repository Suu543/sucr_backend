const express = require("express");
const router = express.Router();

// Validator
const validate = require("../middleware/validate");
const {
  levelCreateValidator,
  levelUpdateValidator,
} = require("../validators/level");

// Auth
const { requireSignin, adminMiddleware } = require("../controllers/auth");

// Controllers
const { create, read, update, remove } = require("../controllers/level");

// Routes
router.get("/levels", read);
router.post(
  "/level",
  validate(levelCreateValidator),
  requireSignin,
  adminMiddleware,
  create
);
router.put(
  "/level/:id",
  validate(levelUpdateValidator),
  requireSignin,
  adminMiddleware,
  update
);
router.delete("/level/:id", requireSignin, adminMiddleware, remove);

module.exports = router;
