import { WebSocketServer } from 'ws';
import { verifyToken } from '../auth/passport.js';

// websocket server for watching all orders
export function adminWebsocket() {
  const wss = new WebSocketServer({ noServer: true });
  wss.on('connection', async (ws, req) => {
    const { auth: { error } = {} } = req;
    ws.on('message', async (data) => {
      const token = data.toString();
      const args = await verifyToken(token);
      if (args.error) {
        ws.send(JSON.stringify({ error: args.error }));
        ws.close();
      } else {
        ws.send(JSON.stringify({ status: 'logged in' }));
      }
    });
    // if (error) {
    //   ws.send(JSON.stringify({ error }));
    //   ws.close();
    // }
    ws.on('close', () => console.error('Client disconnected'));
  });

  return wss;
}
