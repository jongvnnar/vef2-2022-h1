import { WebSocketServer } from 'ws';

export function adminWebsocketServer() {
  const wss = new WebSocketServer({ noServer: true });
  wss.on('connection', async (ws, req) => {
    const { auth: { error } = {} } = req;
    if (error) {
      ws.send(JSON.stringify({ error }));
    }
    ws.send(JSON.stringify({ status: 'logged in' }));

    ws.on('close', () => console.error('Client disconnected'));
  });

  return wss;
}
