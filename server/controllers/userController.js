const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const { userId } = req.query;
    const users = await User.find({ _id: { $ne: userId } }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to get users" });
  }
};
