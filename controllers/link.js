const { Link } = require("../models/link");
const { User } = require("../models/user");
const { Category } = require("../models/category");
const slugify = require("slug");

// create, list, read, update, remove

exports.create = async (req, res) => {
  const { title, url, categories, type, media, level } = req.body;
  const slug = url;
  let link = new Link({ title, url, categories, type, media, level, slug });

  // posted by user
  link.postedBy = req.user._id;

  // save link
  try {
    let data = await link.save();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({
      error: "Link Already Exist!",
    });
  }
};

exports.list = async (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 10;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;

  try {
    let allLinks = await Link.find({})
      .populate("postedBy", "name")
      .populate("categories", "name slug")
      .populate("media", "media _id")
      .populate("type", "type _id")
      .populate("level", "level _id")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json(allLinks);
  } catch (error) {
    return res.status(400).json({
      error: "Could not list links",
    });
  }
};

exports.read = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Link.findOne({ _id: id })
      .populate("media", "media _id")
      .populate("type", "type _id")
      .populate("level", "level _id");

    // console.log("readData", data);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({
      error: "Error Finding Link",
    });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { title, url, categories, type, media, level } = req.body;
  console.log("req.body", req.body);

  try {
    const updated = await Link.findOneAndUpdate(
      { _id: id },
      { title, url, categories, type, media, level },
      { new: true }
    );

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(400).json({
      error: "Error Updating the link",
    });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  try {
    await Link.findOneAndRemove({ _id: id });
    return res.status(200).json({
      message: "Link Removed Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      error: "Error Removing the Link",
    });
  }
};

exports.clickCount = async (req, res) => {
  const { linkId, userId } = req.body;
  try {
    const check = await likeChecker(linkId, userId);

    if (check) {
      const result = await Link.findByIdAndUpdate(
        linkId,
        { $inc: { clicks: -1 } },
        { upsert: true, new: true }
      );

      return res.status(200).json(result);
    } else {
      const result = await Link.findByIdAndUpdate(
        linkId,
        { $inc: { clicks: 1 } },
        { upsert: true, new: true }
      );

      return res.status(200).json(result);
    }
  } catch (error) {
    return res.status(400).json({
      error: "Could not update view count",
    });
  }
};

const likeChecker = async (linkId, _id) => {
  try {
    const link = linkId.toString();
    const user = await User.findById({ _id });
    const likes = user.likes;
    const checker = likes.includes(link);
    // console.log("likes1", likes);

    if (checker) {
      let idx = likes.indexOf(link);
      likes.splice(idx, 1);

      // console.log("likes2", likes);

      user.likes = likes;

      await user.save();

      return true;
    } else {
      likes.push(link.toString());
      user.likes = likes;

      await user.save();

      return false;
    }
  } catch (error) {
    return res.status(400).json({
      error: "Cannot Find User",
    });
  }
};

exports.popular = async (req, res) => {
  try {
    const links = await Link.find({})
      .populate("postedBy", "name")
      .populate("categories", "name")
      .populate("media", "media _id")
      .populate("type", "type _id")
      .populate("level", "level _id")
      .sort({ clicks: -1 })
      .limit(5);

    // console.log("links", links);

    return res.status(200).json(links);
  } catch (error) {
    return res.status(400).json({
      error: "Links Not Found",
    });
  }
};

exports.popularInCategory = async (req, res) => {
  const { slug } = req.params;

  try {
    const category = await Category.findOne({ slug });

    try {
      const links = await Link.find({ categories: category })
        .populate("postedBy", "name")
        .populate("categories", "name")
        .populate("media", "media _id")
        .populate("type", "type _id")
        .populate("level", "level _id")
        .sort({ clicks: -1 });

      return res.status(200).json({
        links: links,
      });
    } catch (error) {
      return res.status(400).json({
        error: "Links Not Found",
      });
    }
  } catch (error) {
    return res.status(400).json({
      error: "Could not load categories",
    });
  }
};
