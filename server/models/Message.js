const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ✅ Added
    text: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
