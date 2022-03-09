import { query } from '../../lib/db.js';

async function listOrder(id) {
  const q = 'SELECT * FROM orders.orders WHERE id = $1';

  const result = await query(q, [id]);

  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

async function listOrderLines(orderId) {
  const q = 'SELECT * FROM orders.lines WHERE order_id = $1';

  const result = await query(q, [orderId]);

  if (result) {
    return result.rows;
  }

  return [];
}

async function createOrder() {
  const q = `
    INSERT INTO orders.orders
    DEFAULT VALUES
    RETURNING *
  `;
  const result = await query(q);

  if (result && result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

export async function createOrderLine({ productId, cartId, quantity } = {}) {
  const q = `
    INSERT INTO orders.lines
      (product_id, cart_id, num_of_products)
    VALUES
      ($1, $2, $3)
    RETURNING *
  `;
  const values = [productId, cartId, quantity];
  const result = await query(q, values);

  if (result && result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

export async function postOrderRoute(req, res) {
  const createdOrder = await createOrder();
  if (createdOrder) {
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

export async function postLineRoute(req, res) {
  const { params: { orderId } = {} } = req;
  const { productId, quantity } = req.body;

  const createdLine = await createOrderLine({ productId, orderId, quantity });

  if (createdLine) {
    return res.status(201).json(createdLine);
  }

  return res.status(500).json({ error: 'Server error' });
}

export async function deleteOrderRoute(req, res) {
  const { params: { orderId } = {} } = req;

  const deleted = await removeOrder(orderId);

  if (deleted) {
    return res.status(204).json();
  }

  return res.status(304).json();
}
