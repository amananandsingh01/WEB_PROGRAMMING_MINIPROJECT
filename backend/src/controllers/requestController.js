import pool from '../config/db.js';

// GET /api/requests
export const getRequests = async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        // Incoming requests (where provider_id = user)
        const incomingResult = await pool.query(`
            SELECT r.id, r.status, r.message, 
                   u.id as user_id, u.username as name
            FROM requests r
            JOIN users u ON r.requester_id = u.id
            WHERE r.provider_id = $1
            ORDER BY r.created_at DESC
        `, [userId]);

        // Outgoing requests (where requester_id = user)
        const outgoingResult = await pool.query(`
            SELECT r.id, r.status, r.message, 
                   u.id as user_id, u.username as name
            FROM requests r
            JOIN users u ON r.provider_id = u.id
            WHERE r.requester_id = $1
            ORDER BY r.created_at DESC
        `, [userId]);

        const mapRequest = (req, type) => ({
            id: req.id,
            user_id: req.user_id,
            name: req.name,
            initials: req.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
            note: req.message || (type === 'incoming' ? `Wants to connect with you` : `You sent a collaboration request`),
            status: req.status
        });

        res.json({
            incoming: incomingResult.rows.map(r => mapRequest(r, 'incoming')),
            outgoing: outgoingResult.rows.map(r => mapRequest(r, 'outgoing'))
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/requests
export const createRequest = async (req, res, next) => {
    try {
        const { provider_id, message } = req.body;
        const requester_id = req.user.id;

        if (provider_id === requester_id) {
            return res.status(400).json({ error: "Cannot send a request to yourself." });
        }

        // Check if request already exists
        const existing = await pool.query(
            'SELECT id FROM requests WHERE requester_id = $1 AND provider_id = $2',
            [requester_id, provider_id]
        );
        if (existing.rows.length > 0) {
            return res.status(400).json({ error: "Request already sent." });
        }

        const newRequest = await pool.query(
            'INSERT INTO requests (requester_id, provider_id, message, status) VALUES ($1, $2, $3, $4) RETURNING *',
            [requester_id, provider_id, message || null, 'pending']
        );
        res.status(201).json(newRequest.rows[0]);
    } catch (error) {
        next(error);
    }
};

// PUT /api/requests/:id
export const updateRequestStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.user.id;

        // Ensure the user is the provider (receiver) of this request
        const requestResult = await pool.query(
            'SELECT id FROM requests WHERE id = $1 AND provider_id = $2',
            [id, userId]
        );

        if (requestResult.rows.length === 0) {
            return res.status(404).json({ error: "Request not found or unauthorized." });
        }

        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ error: "Invalid status." });
        }

        const updated = await pool.query(
            'UPDATE requests SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        res.json(updated.rows[0]);
    } catch (error) {
        next(error);
    }
};

// DELETE /api/requests/:id
export const cancelRequest = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Ensure the user is either the requester or provider
        const requestResult = await pool.query(
            'SELECT id FROM requests WHERE id = $1 AND (requester_id = $2 OR provider_id = $2)',
            [id, userId]
        );

        if (requestResult.rows.length === 0) {
            return res.status(404).json({ error: "Request not found or unauthorized." });
        }

        await pool.query('DELETE FROM requests WHERE id = $1', [id]);
        res.json({ message: "Connection or request removed successfully." });
    } catch (error) {
        next(error);
    }
};