const express = require("express");
const router = express.Router();

// Validators
const validate = require("../middleware/validate");

const {
  linkCreateValidator,
  linkUpdateValidator,
} = require("../validators/link");

// Controllers
const {
  requireSignin,
  authMiddleware,
  adminMiddleware,
  canUpdateDeleteLink,
} = require("../controllers/auth");
const {
  create,
  list,
  read,
  update,
  remove,
  clickCount,
  popular,
  popularInCategory,
} = require("../controllers/link");

// routes
router.get("/link/popular", popular);
router.get("/link/popular/:slug", popularInCategory);
router.post(
  "/link",
  validate(linkCreateValidator),
  requireSignin,
  authMiddleware,
  create
);
router.post("/links", requireSignin, adminMiddleware, list);
router.put("/click-count", clickCount);
router.get("/link/:id", read);
router.put(
  "/link/:id",
  validate(linkUpdateValidator),
  requireSignin,
  authMiddleware,
  canUpdateDeleteLink,
  update
);
router.put(
  "/link/admin/:id",
  validate(linkUpdateValidator),
  requireSignin,
  adminMiddleware,
  update
);
router.delete(
  "/link/:id",
  requireSignin,
  authMiddleware,
  canUpdateDeleteLink,
  remove
);
router.delete("/link/admin/:id", requireSignin, adminMiddleware, remove);

module.exports = router;
