import { WebSocketServer } from 'ws';
import { OrderState } from '../lib/order-state.js';
import { listOrderRoute } from '../routes/orders/orders.js';
export function ordersWebsocketServer() {
  const wss = new WebSocketServer({ noServer: true });

  wss.on('connection', async (ws, req) => {
    const split = req.url?.split('/');
    if (!split || split.length !== 3) {
      ws.close();
    }
    const orderId = split[2];
    const order = await listOrderRoute(null, { params: { orderId } });
    if (!order) {
      ws.send(
        JSON.stringify({ error: `Order with uuid '${orderId}' does not exist` })
      );
      ws.close();
    }
    if (order.current_state === OrderState.finished.name) {
      ws.send(JSON.stringify({ error: 'Order has already finished' }));
      ws.close();
    }
    ws.send(JSON.stringify(order));

    ws.on('close', () => console.log('Client disconnected'));
  });

  return wss;
}
