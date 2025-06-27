const Message = require("../models/Message");
const User = require("../models/User");
const mongoose = require("mongoose");

exports.sendMessage = async (req, res) => {
  try {
    const { sender, receiver, text } = req.body;

    const message = await Message.create({ sender, receiver, text });

    res.status(201).json(message);
  } catch (err) {
    console.error("Error sending message", err);
    res.status(500).json({ message: "Error sending message" });
  }
};

exports.getMessages = async (req, res) => {
  const { senderId, receiverId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "username");

    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages", err);
    res.status(500).json({ message: "Error fetching messages" });
  }
};

exports.getLatestMessages = async (req, res) => {
  try {
    const userId = req.params.userId;

    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(userId) },
            { receiver: new mongoose.Types.ObjectId(userId) },
          ],
        },
      },
      {
        $addFields: {
          userPair: {
            $cond: [
              { $gt: ["$sender", "$receiver"] },
              {
                $concat: [
                  { $toString: "$sender" },
                  "_",
                  { $toString: "$receiver" },
                ],
              },
              {
                $concat: [
                  { $toString: "$receiver" },
                  "_",
                  { $toString: "$sender" },
                ],
              },
            ],
          },
          otherUser: {
            $cond: [
              { $eq: ["$sender", new mongoose.Types.ObjectId(userId)] },
              "$receiver",
              "$sender",
            ],
          },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $group: {
          _id: "$userPair",
          lastMessage: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$lastMessage" },
      },
      {
        $lookup: {
          from: "users",
          localField: "otherUser",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },
      {
        $project: {
          _id: 1,
          text: 1,
          createdAt: 1,
          sender: 1,
          receiver: 1,
          otherUserId: "$userInfo._id",
          otherUsername: "$userInfo.username",
        },
      },
    ]);

    res.json(messages);
  } catch (e) {
    console.error("Aggregation error", e);
    res.status(500).json({ message: "Error getting latest messages" });
  }
};
