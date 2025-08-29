
const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.post('/', authMiddleware, adminOnly, async (req, res) => {
    const { message, level, source, metadata } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO logs (message, level, source, metadata, user_id)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [message, level, source || 'upload', metadata || {}, req.user.id]
        );
        res.status(201).json({ log: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
