const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config();
const { pool } = require('./config/db');
const { producer } = require('./kafka/producer');

app.use(express.json());
app.use(cors());

const authRouter = require('./routes/auth');
const logRouter = require('./routes/logs');
const logWatcher = require("./services/logWatcher");

app.use('/auth', authRouter);
app.use('/logs', logRouter);
logWatcher();

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

process.on('SIGINT', async () => {
    await producer.disconnect();
    process.exit(0);
})