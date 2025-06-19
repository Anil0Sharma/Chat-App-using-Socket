const express = require("express");
const router = express.Router();
const {
  createOrGetConversation,
  getUserConversations,
} = require("../controllers/conversationController");

router.post("/", createOrGetConversation);
router.get("/:userId", getUserConversations);

module.exports = router;
