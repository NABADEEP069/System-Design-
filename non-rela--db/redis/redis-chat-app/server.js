const express = require('express');
const { createServer } = require('http');
const { WebSocketServer } = require('ws');
const Redis = require('ioredis');

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });
const redisPub = new Redis();
const redisSub = new Redis();

app.use(express.static('public')); 
wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('message', (msg) => {
    redisPub.publish('chat', msg.toString());
  });
});

redisSub.subscribe('chat');
redisSub.on('message', (channel, message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) client.send(message); 
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
