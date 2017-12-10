const express = require('express');
const formidable = require('express-formidable');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use('/', express.static(__dirname + '/public'));
app.use(formidable());

wss.on('connection', function connection(ws, req) {
  const location = url.parse(req.url, true);

  ws.on('message', function incoming(message) {
    //console.log('received: %s', message);
    if (message[0] === '#') {
      wss.clients.forEach(function (ws) {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
        }
      });
    }
  });
});

server.listen(8080, function listening() {
  console.log('Listening on %d', server.address().port);
});
