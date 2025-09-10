const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'log-ingestion',
    brokers: ['localhost:9092']
});

module.exports = kafka;