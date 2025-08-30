
const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');

router.post('/', authMiddleware, adminOnly, validate, async (req, res) => {
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

router.get('/logs', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, timestamp, level, source, message, metadata, user_id
            FROM logs 
            ORDER BY timestamp desc`
        );
        res.status(200).json(result.rows)

    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
});

router.get('/aggregate/level', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT level, COUNT(*) as count
            FROM logs
            GROUP BY level
            ORDER BY count DESC`
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
