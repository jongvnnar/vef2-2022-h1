import { WebSocketServer } from 'ws';

// websocket server for watching all orders
export function adminWebsocket() {
  const wss = new WebSocketServer({ noServer: true });
  wss.on('connection', async (ws, req) => {
    const { auth: { error } = {} } = req;
    if (error) {
      ws.send(JSON.stringify({ error }));
      ws.close();
    }
    ws.on('close', () => console.error('Client disconnected'));
    ws.send(JSON.stringify({ status: 'logged in' }));
  });

  return wss;
}
