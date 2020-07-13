const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  media: {
    type: String,
    default: "Video",
    required: true,
  },
});

const Media = mongoose.model("Media", mediaSchema);

module.exports = {
  Media,
};
