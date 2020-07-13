const { Media } = require("../models/media");

// create, read, update, remove
exports.create = async (req, res) => {
  const { media } = req.body;
  let newMedia = new Media({ media });

  try {
    let data = await newMedia.save();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({
      error: "Error Creating Medium...",
    });
  }
};

exports.read = async (req, res) => {
  try {
    let data = await Media.find({});
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({
      error: "Error Reading Mediums",
    });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { media } = req.body;

  try {
    const updated = await Media.findOneAndUpdate(
      { _id: id },
      { media },
      { new: true }
    );

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(400).json({
      error: "Error Updating Medium...",
    });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;

  try {
    await Media.findOneAndRemove({ _id: id });
    return res.status(200).json({
      message: "Medium Removed SuccessFully...",
    });
  } catch (error) {
    return res.status(400).json({
      error: "Error Removing the medium..",
    });
  }
};
