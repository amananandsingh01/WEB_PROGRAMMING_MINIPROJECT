import pool from "../config/db.js";

// -----------------------------------------------------------------------
// GET /api/chat/conversations
// Returns all conversations for the logged-in user with the other
// participant'"'"'s name and the most recent message snippet.
// -----------------------------------------------------------------------
export const getConversations = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(`
            SELECT
                c.id,
                c.created_at,
                -- The other participant
                CASE
                    WHEN c.user1_id = $1 THEN u2.id
                    ELSE u1.id
                END AS other_user_id,
                CASE
                    WHEN c.user1_id = $1 THEN u2.username
                    ELSE u1.username
                END AS other_user_name,
                -- Most recent message in the conversation
                last_msg.content  AS last_message,
                last_msg.created_at AS last_message_at
            FROM conversations c
            JOIN users u1 ON c.user1_id = u1.id
            JOIN users u2 ON c.user2_id = u2.id
            LEFT JOIN LATERAL (
                SELECT content, created_at
                FROM messages
                WHERE conversation_id = c.id
                ORDER BY created_at DESC
                LIMIT 1
            ) last_msg ON TRUE
            WHERE c.user1_id = $1 OR c.user2_id = $1
            ORDER BY COALESCE(last_msg.created_at, c.created_at) DESC
        `, [userId]);

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

// -----------------------------------------------------------------------
// GET /api/chat/conversations/:conversationId/messages
// Returns all messages for a given conversation (most recent last).
// Only accessible if the current user is a participant.
// -----------------------------------------------------------------------
export const getMessages = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { conversationId } = req.params;

        // Verify the user is part of this conversation
        const convCheck = await pool.query(
            "SELECT id FROM conversations WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)",
            [conversationId, userId]
        );
        if (convCheck.rows.length === 0) {
            return res.status(403).json({ error: "Access denied." });
        }

        const result = await pool.query(`
            SELECT
                m.id,
                m.content,
                m.created_at,
                m.sender_id,
                u.username AS sender_name
            FROM messages m
            JOIN users u ON m.sender_id = u.id
            WHERE m.conversation_id = $1
            ORDER BY m.created_at ASC
        `, [conversationId]);

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

// -----------------------------------------------------------------------
// POST /api/chat/send
// Body: { receiver_id, content }
// Finds or creates a conversation between the two users, then inserts
// the message. Returns the new message row.
// -----------------------------------------------------------------------
export const sendMessage = async (req, res, next) => {
    try {
        const senderId = req.user.id;
        const { receiver_id, content } = req.body;

        if (!receiver_id || !content || !content.trim()) {
            return res.status(400).json({ error: "receiver_id and content are required." });
        }

        if (senderId === receiver_id) {
            return res.status(400).json({ error: "You cannot message yourself." });
        }

        // Find existing conversation between these two users (order-agnostic)
        let convResult = await pool.query(`
            SELECT id FROM conversations
            WHERE (user1_id = $1 AND user2_id = $2)
               OR (user1_id = $2 AND user2_id = $1)
        `, [senderId, receiver_id]);

        let conversationId;
        if (convResult.rows.length > 0) {
            conversationId = convResult.rows[0].id;
        } else {
            // Create a new conversation
            const newConv = await pool.query(
                "INSERT INTO conversations (user1_id, user2_id) VALUES ($1, $2) RETURNING id",
                [senderId, receiver_id]
            );
            conversationId = newConv.rows[0].id;
        }

        // Insert the message
        const msgResult = await pool.query(`
            INSERT INTO messages (conversation_id, sender_id, content)
            VALUES ($1, $2, $3)
            RETURNING id, conversation_id, sender_id, content, created_at
        `, [conversationId, senderId, content.trim()]);

        res.status(201).json(msgResult.rows[0]);
    } catch (error) {
        next(error);
    }
};

// -----------------------------------------------------------------------
// POST /api/chat/conversations/open
// Body: { other_user_id }
// Finds or creates a conversation with another user; returns the
// conversation id so the frontend can open the correct chat window.
// -----------------------------------------------------------------------
export const openConversation = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { other_user_id } = req.body;

        if (!other_user_id) {
            return res.status(400).json({ error: "other_user_id is required." });
        }

        // Find or create conversation
        let convResult = await pool.query(`
            SELECT id FROM conversations
            WHERE (user1_id = $1 AND user2_id = $2)
               OR (user1_id = $2 AND user2_id = $1)
        `, [userId, other_user_id]);

        let conversationId;
        if (convResult.rows.length > 0) {
            conversationId = convResult.rows[0].id;
        } else {
            const newConv = await pool.query(
                "INSERT INTO conversations (user1_id, user2_id) VALUES ($1, $2) RETURNING id",
                [userId, other_user_id]
            );
            conversationId = newConv.rows[0].id;
        }

        // Fetch the other user's name
        const userResult = await pool.query(
            "SELECT id, username FROM users WHERE id = $1",
            [other_user_id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        res.json({
            conversation_id: conversationId,
            other_user_id: userResult.rows[0].id,
            other_user_name: userResult.rows[0].username
        });
    } catch (error) {
        next(error);
    }
};
