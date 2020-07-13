const { User } = require("../models/user");
const { Link } = require("../models/link");
const bcrypt = require("bcryptjs");

exports.read = async (req, res) => {
  console.log("User - read");
  // req.profile.hashed_password = undefined;
  // req.profile.salt = undefined;

  try {
    const user = await User.findOne({ _id: req.user._id });

    try {
      const links = await Link.find({ postedBy: user })
        .populate("categories", "name slug")
        .populate("postedBy", "name")
        .populate("media", "media")
        .populate("type", "type")
        .populate("level", "level")
        .sort({ createdAt: -1 });

      user.hashed_password = undefined;
      user.salt = undefined;
      user.resetPasswordLink = undefined;

      return res.status(200).json({ user, links });
    } catch (error) {
      return res.status(400).json({
        error: "Could not find links",
      });
    }
  } catch (error) {
    return res.status(400).json({
      error: "User Not Found...",
    });
  }
};

exports.likes = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById({ _id: id });
    // console.log("user", user.likes);

    return res.status(200).json({
      likes: user.likes,
    });
  } catch (error) {
    return res.status(400).json({
      error: "User Not Found...",
    });
  }
};

exports.update = async (req, res) => {
  const { name, password } = req.body;
  let updated;

  try {
    if (password.length === 0) {
      updated = await User.findOneAndUpdate(
        { _id: req.user._id },
        { name },
        { new: true }
      );
    } else if (password.length > 0 && password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long..." });
    } else if (password.length > 6) {
      const salt = await bcrypt.genSalt(10);
      const hashed_password = await bcrypt.hash(password, salt);
      // console.log("salt", salt);
      // console.log("hashed-password", hashed_password);
      updated = await User.findOneAndUpdate(
        { _id: req.user._id },
        { name, salt, hashed_password },
        { new: true }
      );
    }
    // console.log("updated", updated);
    updated.hashed_password = undefined;
    updated.salt = undefined;

    console.log("User Profile Updated...");
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(400).json({
      error: "Could not find user to update",
    });
  }
};
