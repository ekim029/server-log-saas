const express = require('express');
const app = express();

require('dotenv').config();
const { pool } = require('./config/db');

app.use(express.json());

app.get('/health/db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ ok: true, time: result.rows[0].now });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: err.message });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Listening to port ${process.env.PORT}`);
})