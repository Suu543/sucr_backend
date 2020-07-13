const express = require("express");
const router = express.Router();

// Validators
const validate = require("../middleware/validate");
const {
  mediaCreateValidator,
  mediaUpdateValidator,
} = require("../validators/media");

// Auth
const { requireSignin, adminMiddleware } = require("../controllers/auth");

// Controllers
const { create, read, update, remove } = require("../controllers/media");

// routes
router.get("/medias", read);
router.post(
  "/media",
  validate(mediaCreateValidator),
  requireSignin,
  adminMiddleware,
  create
);
router.put(
  "/media/:id",
  validate(mediaUpdateValidator),
  requireSignin,
  adminMiddleware,
  update
);
router.delete("/media/:id", requireSignin, adminMiddleware, remove);

module.exports = router;
