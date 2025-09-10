
const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');
const produce = require('../kafka/producer');

router.post('/', authMiddleware, adminOnly, validate, async (req, res) => {
    try {
        const log = {
            ...req.body,
            userId: req.user.id
        }
        await produce(log);
        res.status(201).json({ status: 'Log processing' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/logs', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, ts, level, source, message, metadata, user_id
            FROM logs 
            ORDER BY ts desc`
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

router.get('/aggregate/source', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT source, COUNT(*) as count
            FROM logs
            GROUP BY source
            ORDER BY count DESC`
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
})

module.exports = router;
