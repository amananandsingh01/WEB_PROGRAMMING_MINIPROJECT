import pool from '../config/db.js';

// GET /api/users/search?q=name&department=all
export const searchUsers = async (req, res, next) => {
    try {
        const { q = '', department = 'all' } = req.query;

        const query = q.trim().toLowerCase();

        // Build the SQL — join with user_skills + skills so we can search by skill name too
        let sql = `
            SELECT
                u.id,
                u.username,
                u.department,
                u.year,
                u.bio,
                COALESCE(
                    json_agg(DISTINCT s.name) FILTER (WHERE us.type = 'offering' AND s.name IS NOT NULL),
                    '[]'::json
                ) AS teaching
            FROM users u
            LEFT JOIN user_skills us ON us.user_id = u.id
            LEFT JOIN skills s ON s.id = us.skill_id
        `;

        const conditions = [`u.id != $1`];
        const params = [req.user.id];

        if (query) {
            params.push(`%${query}%`);
            conditions.push(`(
                LOWER(u.username) LIKE $${params.length}
                OR EXISTS (
                    SELECT 1 FROM user_skills us2
                    JOIN skills s2 ON s2.id = us2.skill_id
                    WHERE us2.user_id = u.id AND LOWER(s2.name) LIKE $${params.length}
                )
            )`);
        }

        if (department && department !== 'all') {
            params.push(department);
            conditions.push(`u.department = $${params.length}`);
        }

        if (conditions.length) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }


        sql += ' GROUP BY u.id ORDER BY u.username';

        const result = await pool.query(sql, params);

        // Shape each user for the frontend
        const users = result.rows.map(u => ({
            id: u.id,
            name: u.username,
            initials: u.username.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
            department: u.department || 'Not specified',
            year: u.year || '',
            bio: u.bio || '',
            teach: u.teaching.filter(Boolean)
        }));

        res.json(users);
    } catch (error) {
        next(error);
    }
};

// GET /api/users/:id
export const getUserProfile = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // Fetch user basic info
        const userResult = await pool.query(
            `SELECT id, username, bio, department, year, created_at FROM users WHERE id = $1`,
            [id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const user = userResult.rows[0];

        // Fetch skills
        const skillsResult = await pool.query(
            `SELECT us.type, s.name 
             FROM user_skills us 
             JOIN skills s ON s.id = us.skill_id 
             WHERE us.user_id = $1`,
            [id]
        );

        const teach = skillsResult.rows.filter(r => r.type === 'offering').map(r => r.name);
        const learn = skillsResult.rows.filter(r => r.type === 'learning').map(r => r.name);

        res.json({
            id: user.id,
            name: user.username,
            initials: user.username.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
            bio: user.bio,
            department: user.department,
            year: user.year,
            teach,
            learn
        });
    } catch (error) {
        next(error);
    }
};