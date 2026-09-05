import pool from '../config/db.js';

export const createRequest = async (req, res, next) => {
    try {
        const { requester_id, provider_id, skill_id, message } = req.body;
        const newRequest = await pool.query(
            'INSERT INTO requests (requester_id, provider_id, skill_id, message) VALUES ($1, $2, $3, $4) RETURNING *',
            [requester_id, provider_id, skill_id, message]
        );
        res.status(201).json(newRequest.rows[0]);
    } catch (error) {
        next(error);
    }
};