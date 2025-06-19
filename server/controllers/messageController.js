const Message = require("../models/Message");

exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, sender, text } = req.body;
    const message = await Message.create({ conversationId, sender, text });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: "Error sending message" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    }).populate("sender", "username");
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages" });
  }
};
