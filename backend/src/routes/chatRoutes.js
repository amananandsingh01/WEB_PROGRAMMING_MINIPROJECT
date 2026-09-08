import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
    getConversations,
    getMessages,
    sendMessage,
    openConversation
} from "../controllers/chatController.js";

const router = express.Router();

// All chat routes require JWT authentication
router.use(authMiddleware);

// GET  /api/chat/conversations         — list all conversations for logged-in user
router.get("/conversations", getConversations);

// GET  /api/chat/conversations/:id/messages — fetch messages in a conversation
router.get("/conversations/:conversationId/messages", getMessages);

// POST /api/chat/conversations/open    — find or create conversation with a user
router.post("/conversations/open", openConversation);

// POST /api/chat/send                  — send a message
router.post("/send", sendMessage);

export default router;
