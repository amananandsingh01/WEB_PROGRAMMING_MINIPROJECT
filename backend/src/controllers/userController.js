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

// GET /api/users/suggestions
// Returns up to 6 non-connected users ranked by skill overlap:
//   +2 pts if they teach something I want to learn
//   +2 pts if they want to learn something I can teach
//   +1 pt for same department
// Excludes: self, already connected, pending requests in either direction
export const getSuggestions = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Get current user's own skills
        const mySkillsRes = await pool.query(
            `SELECT s.id, s.name, us.type
             FROM user_skills us
             JOIN skills s ON s.id = us.skill_id
             WHERE us.user_id = $1`,
            [userId]
        );

        const myOffering  = mySkillsRes.rows.filter(r => r.type === 'offering').map(r => r.id);
        const myLearning  = mySkillsRes.rows.filter(r => r.type === 'learning').map(r => r.id);
        const myDeptRes   = await pool.query('SELECT department FROM users WHERE id = $1', [userId]);
        const myDept      = myDeptRes.rows[0]?.department || null;

        // Get IDs of users already connected or with a pending request (either direction)
        const excludeRes = await pool.query(
            `SELECT CASE WHEN requester_id = $1 THEN provider_id ELSE requester_id END AS other_id
             FROM requests
             WHERE (requester_id = $1 OR provider_id = $1)
               AND status IN ('pending', 'accepted')`,
            [userId]
        );
        const excludeIds = excludeRes.rows.map(r => r.other_id);
        excludeIds.push(userId); // also exclude self

        // Fetch all other users with their skills
        const allUsersRes = await pool.query(
            `SELECT
                u.id,
                u.username,
                u.department,
                u.year,
                u.bio,
                COALESCE(
                    json_agg(DISTINCT jsonb_build_object('id', s.id, 'name', s.name, 'type', us.type))
                    FILTER (WHERE s.id IS NOT NULL),
                    '[]'::json
                ) AS skills
             FROM users u
             LEFT JOIN user_skills us ON us.user_id = u.id
             LEFT JOIN skills s ON s.id = us.skill_id
             WHERE u.id != ALL($1::uuid[])
             GROUP BY u.id`,
            [excludeIds]
        );

        // Score each candidate
        const scored = allUsersRes.rows.map(u => {
            const theirOffering = u.skills.filter(s => s.type === 'offering').map(s => s.id);
            const theirLearning = u.skills.filter(s => s.type === 'learning').map(s => s.id);

            let score = 0;
            // They can teach what I want to learn
            for (const sid of myLearning) {
                if (theirOffering.includes(sid)) score += 2;
            }
            // They want to learn what I can teach
            for (const sid of myOffering) {
                if (theirLearning.includes(sid)) score += 2;
            }
            // Same department bonus
            if (myDept && u.department === myDept) score += 1;

            return {
                id: u.id,
                name: u.username,
                initials: u.username.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
                department: u.department || 'Not specified',
                year: u.year || '',
                bio: u.bio || '',
                teach: u.skills.filter(s => s.type === 'offering').map(s => s.name),
                matchScore: score
            };
        });

        // Sort by score descending, shuffle ties, return top 6
        scored.sort((a, b) => b.matchScore - a.matchScore);
        const top = scored.slice(0, 6);

        res.json(top);
    } catch (error) {
        next(error);
    }
};