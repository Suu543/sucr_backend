const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const linkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      max: 256,
    },

    url: {
      type: String,
      trim: true,
      required: true,
      max: 256,
    },

    slug: {
      type: String,
      lowercase: true,
      required: true,
      index: true,
    },

    postedBy: {
      type: ObjectId,
      ref: "User",
    },

    categories: [
      {
        type: ObjectId,
        ref: "Category",
        required: true,
      },
    ],

    type: {
      type: ObjectId,
      ref: "Type",
    },

    media: {
      type: ObjectId,
      ref: "Media",
    },

    level: {
      type: ObjectId,
      ref: "Level",
    },

    clicks: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Link = mongoose.model("Link", linkSchema);

module.exports = {
  Link,
};

// type: {
//   type: String,
//   default: "Free",
// },

// medium: {
//   type: String,
//   default: "Video",
// },
