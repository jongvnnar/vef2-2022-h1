import WebSocket from 'ws';
import xss from 'xss';
// eslint-disable-next-line import/no-cycle
import { adminWss, orderWss } from '../../app.js';
import { pagedQuery, query } from '../../lib/db.js';
import { OrderState } from '../../lib/order-state.js';
import { addPageMetadata } from '../../lib/utils/addPageMetadata.js';
import { listCartLines } from '../carts/carts.js';
import { findMenuItemById } from '../menus/menus.js';

export async function addProductDetail(lines) {
  const result = [];
  for (const line of lines) {
    const { product_id: productId, quantity } = line;
    // eslint-disable-next-line no-await-in-loop
    const { title, description, image, category, price } =
      await findMenuItemById(productId);
    const newLine = {
      productId,
      title,
      description,
      image,
      category,
      quantity,
      price,
      total: price * quantity,
    };
    result.push(newLine);
  }
  return result;
}

export async function listOrderLines(orderId) {
  const q = 'SELECT product_id, quantity FROM orders.lines WHERE order_id = $1';

  const result = await query(q, [orderId]);

  if (result) {
    return addProductDetail(result.rows);
  }

  return [];
}

async function listOrderStates(orderId) {
  const q =
    'SELECT state, created FROM orders.states WHERE order_id = $1 ORDER BY created DESC';

  const result = await query(q, [orderId]);
  if (result) {
    return result.rows;
  }

  return [];
}

async function listOrder(orderId) {
  const q = 'SELECT * FROM orders.orders WHERE id = $1';
  const result = await query(q, [orderId]);
  if (result && result.rowCount === 1) {
    const order = result.rows[0];
    const lines = await listOrderLines(orderId);
    const status = await listOrderStates(orderId);
    return { ...order, lines, status };
  }

  return null;
}

export async function listOrderRoute(_, req) {
  const { params: { orderId } = {} } = req;
  const order = await listOrder(orderId);
  if (!order) return null;
  const lines = await listOrderLines(orderId);
  const status = await listOrderStates(orderId);
  return { ...order, lines, status };
}

async function updateOrder({ orderId, newStatus }) {
  const q = `
  UPDATE orders.orders
  SET current_state = $1, current_state_created = NOW()
  WHERE id = $2 RETURNING id
  `;
  const values = [xss(newStatus), xss(orderId)];
  const result = await query(q, values);
  if (result && result.rowCount === 1) {
    return true;
  }
  return false;
}

export async function createOrderLine({ orderId, productId, quantity } = {}) {
  const q = `
    INSERT INTO orders.lines
      (order_id, product_id, quantity)
    VALUES
      ($1, $2, $3)
    RETURNING *
  `;
  const values = [xss(orderId), productId, quantity];
  const result = await query(q, values);

  if (result && result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

async function createOrder({ cart, name }) {
  const q = `
    INSERT INTO orders.orders (name)
    VALUES ($1)
    RETURNING id, current_state
  `;
  const values = [xss(name)];
  const result = await query(q, values);
  const cartLines = await listCartLines(cart);
  if (result && result.rowCount === 1) {
    if (cartLines && cartLines.length !== 0) {
      cartLines.forEach(async (cartLine) => {
        await createOrderLine({
          orderId: result.rows[0].id,
          productId: cartLine.product_id,
          quantity: cartLine.quantity,
        });
      });
    }
    return result.rows[0];
  }
  return null;
}

export async function listAllOrdersRoute(req, res) {
  const { offset = 0, limit = 10 } = req.query;
  const q = `
  SELECT * FROM orders.orders ORDER BY created DESC
  `;
  const orders = await pagedQuery(q, [], { offset, limit });
  const page = addPageMetadata(
    orders,
    req.path,
    {
      offset,
      limit,
      length: orders.items.length,
    },
    req.baseUrl
  );
  return res.status(200).json(page);
}

export async function postOrderRoute(req, res) {
  const { cart = '', name = '' } = req.body;
  const createdOrder = await createOrder({ cart, name });
  if (createdOrder) {
    // send new orders to admin websocket
    adminWss.clients.forEach(async (client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(await listOrder(createdOrder.id)));
      }
    });

    // return created order
    return res.status(201).json(createdOrder);
  }

  return res.status(500).json({ error: 'Server error' });
}

export async function getOrderRoute(_, req) {
  const { params: { orderId } = {} } = req;
  const order = await listOrder(orderId);
  if (!order) return null;
  const lines = await listOrderLines(orderId);
  return { ...order, lines };
}

export async function listOrderStateRoute(_, req) {
  const { params: { orderId } = {} } = req;
  const states = await listOrderStates(orderId);
  if (states.length === 0) {
    return null;
  }
  return states;
}

export async function postOrderStateRoute(req, res) {
  const { params: { orderId } = {}, body: { status } = {} } = req;
  const order = req.resource;
  if (order) {
    let newStatus = '';
    try {
      newStatus = OrderState.fromString(order.current_state).getNextState()
        .name;
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    if (status !== newStatus) {
      return res.status(400).json({
        error: `Unable to go from ${order.current_state} to ${status}, next status must be ${newStatus}`,
      });
    }
    const result = await updateOrder({ orderId, newStatus });
    if (result) {
      // send to websocket client for regular users
      orderWss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ status: newStatus }));
        }
      });

      const newOrder = await listOrder(orderId);

      // send updated order to websocket client for admins
      adminWss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(newOrder));
        }
      });
      // return updated order
      return res.status(200).json(newOrder);
    }
  }
  return res.status(500).json({ error: 'Unable to update order status' });
}
