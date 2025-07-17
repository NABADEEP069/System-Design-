const Redis = require('ioredis');

const subscriber = new Redis(); 
const publisher = new Redis(); 

subscriber.subscribe('mychannel', (err, count) => {
  if (err) throw err;
  console.log(` Subscribed to ${count} channel(s). Waiting for messages...`);
});

subscriber.on('message', (channel, message) => {
  console.log(` Received from ${channel}: ${message}`);
});

setTimeout(() => {
  publisher.publish('mychannel', ' Hello, from Nabadeep ');
}, 2000);



