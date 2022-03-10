import xss from 'xss';
import { pagedQuery, query } from '../../lib/db.js';
import { addPageMetadata } from '../../lib/utils/addPageMetadata.js';
import { listCartLines } from '../carts/carts.js';
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

async function createOrder({ cart, name }) {
  const q = `
    INSERT INTO orders.orders (name)
    VALUES ($1)
    RETURNING id, current_state
  `;
  const values = [xss(name)];
  const result = await query(q, values);
  const cartLines = await listCartLines(cart);
  console.log(cartLines);
  if (result && result.rowCount === 1) {
    if (cartLines && cartLines.length !== 0) {
      cartLines.forEach(async (cartLine) => {
        await createOrderLine({
          orderId: result.rows[0].id,
          cartId: cartLine.cart_id,
          productId: cartLine.product_id,
          quantity: cartLine.quantity,
        });
      });
    }
    return result.rows[0];
  }

  return null;
}

export async function createOrderLine({
  orderId,
  productId,
  cartId,
  quantity,
} = {}) {
  const q = `
    INSERT INTO orders.lines
      (order_id, product_id, cart_id, quantity)
    VALUES
      ($1, $2, $3, $4)
    RETURNING *
  `;
  const values = [xss(orderId), productId, xss(cartId), quantity];
  const result = await query(q, values);

  if (result && result.rowCount === 1) {
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
