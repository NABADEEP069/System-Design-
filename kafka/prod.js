const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();

const run = async () => {
  await producer.connect();

  const events = [
    { value: 'user1,home' },
    { value: 'user2,about' },
    { value: 'user3,contact' }
  ];

  for (const event of events) {
    await producer.send({
      topic: 'clicks',
      messages: [event]
    });
    console.log(`Sent: ${event.value}`);
  }

  await producer.disconnect();
};

run().catch(console.error);
