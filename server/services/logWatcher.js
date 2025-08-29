const chokidar = require("chokidar");
const fs = require('fs');
const csv = require('csv-parser');
const { pool } = require('../config/db.js');
const path = require('path');


async function parseAndInsert(filePath) {
    let rows = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            rows.push(row);
        })
        .on('end', async () => {
            try {
                const client = await pool.connect();
                try {
                    for (let row of rows) {
                        let { message, level, source, metadata } = row;

                        if (!message || !level || !source) {
                            console.warn(`Skipping invalid row: ${JSON.stringify(row)}`);
                            continue;
                        }

                        await client.query(
                            `INSERT INTO logs (message, level, source, metadata)
                            VALUES ($1, $2, $3, $4)`,
                            [message, level, source, metadata ? JSON.stringify(metadata) : null]
                        );
                    }
                } finally {
                    client.release();
                }

            } catch (err) {
                console.log({ error: err.message });
                throw err;
            }
        })
        .on('error', (err) => console.error(err));
}

function watchLogs() {
    const logDirectory = path.resolve(__dirname, "../uploads");
    const watcher = chokidar.watch(logDirectory, {
        persistent: true,
        ignoreInitial: true
    });

    watcher.on('add', (filepath) => {
        parseAndInsert(filepath);
    })
}

module.exports = watchLogs;