const kafka = require('./index.js');

const producer = kafka.producer();
let connected = false;

async function produce(log) {
    if (!connected) {
        await producer.connect();
        connected = true;
    }

    await producer.send({
        topic: 'logs',
        messages: [
            { value: JSON.stringify(log) }
        ]
    });
}

module.exports = {
    producer, produce
}