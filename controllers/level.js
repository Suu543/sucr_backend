const { Level } = require("../models/level");

exports.create = async (req, res) => {
  const { level } = req.body;
  let newLevel = new Level({ level });

  try {
    let data = await newLevel.save();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({
      error: "Error Creating Level...",
    });
  }
};

exports.read = async (req, res) => {
  try {
    let data = await Level.find({});
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({
      error: "Error Reading Level...",
    });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { level } = req.body;

  try {
    const updated = await Level.findOneAndUpdate(
      { _id: id },
      { level },
      { new: true }
    );

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(400).json({ error: "Error Updating Level..." });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;

  try {
    await Level.findOneAndRemove({ _id: id });
    return res.status(200).json({
      message: "Level Removed Successfully...",
    });
  } catch (error) {
    return res.status(400).json({
      error: "Error Removing the level...",
    });
  }
};
