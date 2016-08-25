'use strict';
import ws from 'nodejs-websocket';
import httpListen from './http-server';
// CONFIG
const HTTP_PORT = 8080;
const WS_PORT = 8081;
//

global.buttonState = {}

const refreshWSData = (conn) => {
  conn.sendText(JSON.stringify(global.buttonState));
}

const wsListen = (WS_PORT) => {
  return new Promise((resolve, reject) => {
    const onText = (str) => {
      if(str === 'reset') {
        global.buttonState = {};
      }
    }

    const onConnection = (conn) => {
      conn.on('text', (str) => {
        onText(str);
        refreshWSData(conn);
      });
      refreshWSData(conn);
    }

    const server = ws.createServer(onConnection);
    server.on('listening', () => {
      console.log(`Now listening for WebSocket connections on :${WS_PORT}`);
      resolve(() => {
        server.connections.forEach((conn) => {
          refreshWSData(conn);
        });
      });
    });
    server.listen(WS_PORT)
  });
}

export const runServer = () => {
  wsListen(WS_PORT).then((onButtonMessage) => httpListen(HTTP_PORT, onButtonMessage));
}
