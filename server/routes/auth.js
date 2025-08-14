const express = require('express');
const router = express.Router();
const { pool } = require('../config/db.js');
const bcrypt = require('bcryptjs')

router.post('/register', async (req, res) => {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
        return res.status(400).json({ error: 'Missing field' });
    }

    try {
        const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const password_hash = await bcrypt.hash(password, 12);

        const result = await pool.query(
            `INSERT INTO users (email, name, password_hash)
            VALUES ($1, $2, $3)
            RETURNING id, email, name, role, created_at`,
            [email, name, password_hash]
        );

        res.status(200).json({ result })

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {

});

module.exports = router;
