
const { pool } = require('../config/db');
const kafka = require('./index.js');

const consumer = kafka.consumer({ groupId: 'logs' });

async function startConsumer() {
    await consumer.connect();

    await consumer.subscribe({ topic: 'logs', fromBeginning: false });
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try {
                const log = JSON.parse(message.value.toString());
                const { message: msg, level, source, metadata, userId } = log;
                await pool.query(
                    `INSERT INTO logs (message, level, source, metadata, user_id)
                     VALUES ($1, $2, $3, $4, $5)
                     RETURNING *`,
                    [msg, level, source, metadata, userId]
                );
            } catch (err) {
                console.log(err.message);
            }
        }
    })
}

module.exports = startConsumer;