const mongoose = require("mongoose");

const levelSchema = new mongoose.Schema({
  level: {
    type: String,
    required: true,
  },
});

const Level = mongoose.model("Level", levelSchema);

module.exports = {
  Level,
};
