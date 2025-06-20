const Conversation = require("../models/Conversation");

exports.createOrGetConversation = async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        members: [senderId, receiverId],
      });
    }
    res.json(conversation);
  } catch (err) {
    res.status(500).json({ message: "Error creating or finding conversation" });
  }
};

exports.getUserConversations = async (req, res) => {
  try {
    const userId = req.params.userId;
    const conversations = await Conversation.find({
      members: { $in: [userId] },
    }).populate("members", "username");

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: "Error getting conversations" });
  }
};
