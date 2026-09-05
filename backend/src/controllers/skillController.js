import pool from '../config/db.js';

// GET /api/profile/skills
export const getUserSkills = async (req, res, next) => {
    try {
        const result = await pool.query(
            `SELECT us.type, us.skill_id AS id, s.name
             FROM user_skills us
             JOIN skills s ON s.id = us.skill_id
             WHERE us.user_id = $1
             ORDER BY s.name`,
            [req.user.id]
        );
        const offering = result.rows.filter(r => r.type === 'offering').map(r => ({ id: r.id, name: r.name }));
        const learning = result.rows.filter(r => r.type === 'learning').map(r => ({ id: r.id, name: r.name }));
        res.json({ offering, learning });
    } catch (error) {
        next(error);
    }
};

// POST /api/profile/skills  body: { skillName, type }
export const addUserSkill = async (req, res, next) => {
    try {
        const { skillName, type } = req.body;
        if (!skillName || !['offering', 'learning'].includes(type)) {
            return res.status(400).json({ error: 'skillName and a valid type (offering|learning) are required.' });
        }
        const skillResult = await pool.query(
            `INSERT INTO skills (name, category)
             VALUES ($1, 'General')
             ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
             RETURNING id`,
            [skillName.trim()]
        );
        const skillId = skillResult.rows[0].id;
        await pool.query(
            `INSERT INTO user_skills (user_id, skill_id, type) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
            [req.user.id, skillId, type]
        );
        res.status(201).json({ id: skillId, name: skillName.trim(), type });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/profile/skills/:skillId/:type
export const removeUserSkill = async (req, res, next) => {
    try {
        const { skillId, type } = req.params;
        await pool.query(
            `DELETE FROM user_skills WHERE user_id = $1 AND skill_id = $2 AND type = $3`,
            [req.user.id, parseInt(skillId, 10), type]
        );
        res.json({ message: 'Skill removed.' });
    } catch (error) {
        next(error);
    }
};

// PUT /api/profile/update  body: { username, bio, department, year }
export const updateProfile = async (req, res, next) => {
    try {
        const { username, bio, department, year } = req.body;
        if (!username || !username.trim()) {
            return res.status(400).json({ error: 'Username is required.' });
        }
        const result = await pool.query(
            `UPDATE users SET username = $1, bio = $2, department = $3, year = $4
             WHERE id = $5
             RETURNING id, username, email, bio, department, year`,
            [username.trim(), bio || null, department || null, year || null, req.user.id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};