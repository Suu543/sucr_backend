const express = require("express");
const router = express.Router();

// import middlewares
const {
  requireSignin,
  authMiddleware,
  adminMiddleware,
} = require("../controllers/auth");

// import validator
const { userUpdateValidator } = require("../validators/auth");
const validate = require("../middleware/validate");

// import controllers
const { read, update, likes } = require("../controllers/user");

// routes
router.get("/user", requireSignin, authMiddleware, read);
router.get("/admin", requireSignin, adminMiddleware, read);
router.put(
  "/user",
  validate(userUpdateValidator),
  requireSignin,
  authMiddleware,
  update
);
router.post("/user/likes/:id", likes);

module.exports = router;
