const Redis = require('ioredis');

const subscriber = new Redis(); // listens
const publisher = new Redis();  // sends

subscriber.subscribe('mychannel', (err, count) => {
  if (err) throw err;
  console.log(` Subscribed to ${count} channel(s). Waiting for messages...`);
});

subscriber.on('message', (channel, message) => {
  console.log(` Received from ${channel}: ${message}`);
});

setTimeout(() => {
  publisher.publish('mychannel', '🔔 Hello, real-time world!');
}, 2000);
