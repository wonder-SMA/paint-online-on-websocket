const express = require('express');
const app = express();
const WSServer = require('express-ws')(app);
const aWss = WSServer.getWss();

const PORT = process.env['PORT'] || 5000;

app.ws('/', (ws, req) => {
  console.log('The connection has been established');
  ws.send('You are successfully connected');
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    switch (msg.method) {
      case 'connection':
        handleConnection(ws, msg);
        break;
      case 'setTool':
        broadcastConnection(ws, msg);
        break;
      case 'setSetting':
        broadcastConnection(ws, msg);
        break;
      case 'draw':
        broadcastConnection(ws, msg);
        break;
      case 'finishDrawing':
        broadcastConnection(ws, msg);
        break;
    }
  };
});

app.listen(PORT, () => {
  console.log(`The server has been started on port: ${PORT}`);
});

const broadcastConnection = (ws, msg) => {
  aWss.clients.forEach(client => {
    if (client.id === msg.id) {
      client.send(JSON.stringify(msg));
    }
  });
};

const handleConnection = (ws, msg) => {
  ws.id = msg.id;
  broadcastConnection(ws, msg);
};

