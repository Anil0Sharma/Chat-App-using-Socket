const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getMessages,
  getLatestMessages,
} = require("../controllers/messageController");

router.post("/", sendMessage);
router.get("/latest/:userId", getLatestMessages);
router.get("/:senderId/:receiverId", getMessages);

module.exports = router;
