const WebSocket = require('ws');
const redis = require('redis');


const wss = new WebSocket.Server({ port: 8080 }, () => {
  console.log('WebSocket server started on ws://localhost:8080');
});


const subscriber = redis.createClient();
const publisher = redis.createClient();


subscriber.subscribe('mychannel');

subscriber.on('message', (channel, message) => {
  console.log(`Redis: ${message} on ${channel}`);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });      
});
wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log(`Received from client: ${message}`);
    
    publisher.publish('mychannel', message);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
