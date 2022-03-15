/* eslint-disable camelcase */
import { query } from '../../lib/db.js';

export async function listCart(id) {
  const q = 'SELECT * FROM carts.carts WHERE id = $1';

  const result = await query(q, [id]);

  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

async function listCartLine(id) {
  const q = 'SELECT * FROM carts.lines WHERE id = $1';

  const result = await query(q, [id]);

  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

export async function listCartLines(cartId) {
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

export async function createCartLine({ product, cartId, quantity } = {}) {
  const q = `
    INSERT INTO carts.lines
      (product_id, cart_id, quantity)
    VALUES
      ($1, $2, $3)
    RETURNING *
  `;
  const values = [product, cartId, quantity];
  const result = await query(q, values);

  if (result && result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

export async function updateCartLineQuantity(id, newQuantity) {
  const q = `
    UPDATE carts.lines
    SET quantity = $1
    WHERE id = $2
    RETURNING *
  `;
  const values = [newQuantity, id];
  const result = await query(q, values);

  if (result && result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

async function removeCartLine(id) {
  const q = 'DELETE FROM carts.lines WHERE id = $1 RETURNING *';

  const result = await query(q, [id]);
  if (result && result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

// nota frekar það fall sem mun koma í products
export async function listProduct(id) {
  const q = 'SELECT * FROM menu.products WHERE id = $1';

  const result = await query(q, [id]);

  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}
// -----------------------------------------

async function addProductDetail(cartLines) {
  const result = [];
  for (const line of cartLines) {
    const { id, product_id, quantity } = line;
    // eslint-disable-next-line no-await-in-loop
    const { title, description, image, category, price } = await listProduct(
      product_id
    );
    const newLine = {
      id,
      product_id,
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

export async function postCartRoute(req, res) {
  const createdCart = await createCart();

  return res.status(201).json(createdCart);
}

export async function getCartRoute(_, req) {
  const { params: { cartId } = {} } = req;
  const cart = await listCart(cartId);
  if (!cart) return null;
  let lines = await listCartLines(cartId);
  lines = await addProductDetail(lines);
  return { ...cart, lines };
}

export async function getLineRoute(_, req) {
  const { params: { id } = {} } = req;
  const line = await listCartLine(id);
  if (!line) return null;
  const detailLine = (await addProductDetail([line]))[0];
  return detailLine;
}

export async function postLineRoute(req, res) {
  const { params: { cartId } = {} } = req;
  const { product, quantity } = req.body;

  const createdLine = await createCartLine({ product, cartId, quantity });

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

export async function patchLineRoute(req, res) {
  const { params: { id } = {} } = req;
  const { quantity } = req.body;

  const updatedLine = await updateCartLineQuantity(id, quantity);

  if (updatedLine) {
    return res.status(200).json(updatedLine);
  }

  return res.status(500).json({ error: 'Server error' });
}

export async function deleteLineRoute(req, res) {
  const { params: { id } = {} } = req;

  const deleted = await removeCartLine(id);

  if (deleted) {
    return res.status(204).json();
  }

  return res.status(304).json();
}
