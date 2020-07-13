const { Type } = require("../models/type");

// create, read, update, remove
exports.create = async (req, res) => {
  const { type } = req.body;
  let newType = new Type({ type });

  try {
    let data = await newType.save();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({
      error: "Error Creating Type...",
    });
  }
};

exports.read = async (req, res) => {
  try {
    let data = await Type.find({});
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({
      error: "Error Reading Types",
    });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;

  try {
    const updated = await Type.findOneAndUpdate(
      { _id: id },
      { type },
      { new: true }
    );

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(400).json({
      error: "Error Updating Type...",
    });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;

  try {
    await Type.findOneAndRemove({ _id: id });
    return res.status(200).json({
      message: "Type Removed SuccessFully...",
    });
  } catch (error) {
    return res.status(400).json({
      error: "Error Removing the type..",
    });
  }
};
