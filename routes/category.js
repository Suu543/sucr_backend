const express = require("express");
const router = express.Router();

// Validators
const validate = require("../middleware/validate");

const {
  categoryCreateValidator,
  categoryUpdateValidator,
} = require("../validators/category");

// Controllers
const { requireSignin, adminMiddleware } = require("../controllers/auth");
const {
  create,
  list,
  interest,
  read,
  update,
  remove,
  categorySearch,
} = require("../controllers/category");

// routes
router.get("/categories", list);
router.get("/categories/interested", interest);
router.post("/categories/search", categorySearch);
router.post("/category/:slug", read);
router.post(
  "/category",
  validate(categoryCreateValidator),
  requireSignin,
  adminMiddleware,
  create
);
// router.post("/category", requireSignin, adminMiddleware, create);
router.put(
  "/category/:slug",
  validate(categoryUpdateValidator),
  requireSignin,
  adminMiddleware,
  update
);
router.delete("/category/:slug", requireSignin, adminMiddleware, remove);

module.exports = router;
