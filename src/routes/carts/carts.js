import { query } from '../../lib/db.js';

async function listCart(id) {
  const q = 'SELECT * FROM carts.carts WHERE id = $1';

  const result = await query(q, [id]);

  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

async function listCartLines(cartId) {
  const q = 'SELECT * FROM carts.lines WHERE cart_id = $1';

  const result = await query(q, [cartId]);

  if (result) {
    return result.rows;
  }

  return [];
}

async function createCart() {
  const q = `
    INSERT INTO carts.carts
    DEFAULT VALUES
    RETURNING *
  `;
  const result = await query(q);

  if (result && result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

async function removeCart(cartId) {
  const q = 'DELETE FROM carts.carts WHERE id = $1 RETURNING *';

  const result = await query(q, [cartId]);
  if (result && result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

export async function createCartLine({ productId, cartId, quantity } = {}) {
  const q = `
    INSERT INTO carts.lines
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

export async function postCartRoute(req, res) {
  const createdCart = await createCart();

  return res.json(createdCart);
}

export async function getCartRoute(_, req) {
  const { params: { cartId } = {} } = req;
  const cart = await listCart(cartId);
  if (!cart) return null;
  const lines = await listCartLines(cartId);
  return { ...cart, lines};
}

export async function postLineRoute(req, res) {
  const { params: { cartId } = {} } = req;
  const { productId, quantity } = req.body;

  const createdLine = await createCartLine({ productId, cartId, quantity });

  if (createdLine) {
    return res.status(201).json(createdLine);
  }

  return res.status(500).json({ error: 'Server error' });
}

export async function deleteCartRoute(req, res) {
  const { params: { cartId } = {} } = req;

  const deleted = await removeCart(cartId);

  if (deleted) {
    return res.status(204).json();
  }

  return res.status(304).json();
}
