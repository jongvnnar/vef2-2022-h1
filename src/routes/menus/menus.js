import xss from 'xss';
import { pagedQuery, query } from '../../lib/db.js';
import { addPageMetadata } from '../../lib/utils/addPageMetadata.js';

// TODO params
export async function listMenuItems(req, res) {
  const { offset = 0, limit = 10 } = req.query;
  // const { category = '', search = '' } = req.parmas;
  const q = `
  SELECT id,title,price,description,image,category,created,updated
  FROM menu.products
  ORDER BY id ASC
  `;
  const menuItems = await pagedQuery(q, [], { offset, limit });
  const page = addPageMetadata(
    menuItems,
    req.path,
    {
      offset,
      limit,
      length: menuItems.items.length,
    },
    req.baseUrl
  );
  return res.status(200).json(page);
}

export async function findMenuItemById(id) {
  const q = `
    SELECT id,title,price,description,image,category,created,updated
    FROM menu.products
    WHERE id = $1`;

  try {
    const result = await query(q, [id]);

    if (result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (e) {
    console.error('Gat ekki fundið menu product eftir id');
    return null;
  }

  return false;
}

export async function createMenuItem(title, price, description, category, image) {
  const q = `
    INSERT INTO menu.products (title, price, description, category, image)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING title, price, description, category, image

    `;

  try {
    const result = await query(q, [xss(title), price, xss(description), category, image]);
    return result.rows[0];
  } catch (e) {
    console.error('Gat ekki búið til vöru');
  }

  return null;
}

export async function conditionalUpdateMenu(id, values) {
  if (values.length === 0) return null;
  const { title = '', price = null, description = '', category = null, image = '' } = values;

  // https://medium.com/developer-rants/conditional-update-in-postgresql-a27ddb5dd35
  const q = `
  UPDATE menu.products SET
  title = COALESCE(NULLIF($1, ''), title),
  price = COALESCE($2, price),
  description = COALESCE(NULLIF($3, ''), description),
  category = COALESCE(NULLIF($4, ''), category),
  image = COALESCE(NULLIF($5, ''), image)
  WHERE id = $6
  RETURNING title, price, description, category, image;
  `;
  const vals = [xss(title), price, xss(description), category, xss(image), xss(id)];
  try {
    const result = await query(q, vals);
    return result.rows[0];
  } catch (e) {
    console.error('Gat ekki uppfært vöru');
  }

  return null;
}

export async function deleteMenuItem(id) {
  const q = `
  DELETE FROM menu.products
  WHERE id = $1
  RETURNING *;`;

  try {
    const result = await query(q, [id]);
    return result.rows[0];
  } catch (e) {
    console.error('Gat ekki eytt vöru');
  }

  return null;
}

// asdfasd
export async function getMenuItem(_, req) {
  const { params: { id } = {} } = req;
  const category = await findMenuItemById(id);
  return category;
}

export async function postMenuItemRoute(req, res) {
  const { title, price, description, category, image } = req.body;

  const result = await createMenuItem(title, price, description, category, image);

  if (result) {
    return res.status(201).json(result);
  }

  return res.status(500).json({ error: 'Server error' });
}

export async function patchMenuItemRoute(req, res) {
  const { id } = req.params;
  const { values } = req.body;

  const result = await conditionalUpdateMenu(id, values);

  if (result) {
    return res.status(200).json(result);
  }

  return res.status(500).json({ error: 'Server error' });
}

export async function deleteMenuItemRoute(req, res) {
  const { id } = req.params;

  const result = await deleteMenuItem(id);

  if (result) {
    return res.status(204).json({});
  }

  return res.status(500).json({ error: 'Server error' });
}
