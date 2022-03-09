import xss from 'xss';
import { pagedQuery, query } from '../../lib/db.js';
import { addPageMetadata } from '../../lib/utils/addPageMetadata.js';

//sækja í gagnagrunn
export async function listCategories(req, res) {
  const { offset = 0, limit = 10 } = req.query;
  const query = `
    SELECT * FROM menu.categories
    ORDER BY id ASC
    `;
  const categories = await pagedQuery(query, [], { offset, limit });
  const page = addPageMetadata(
    categories,
    req.path,
    {
      offset,
      limit,
      length: categories.items.length,
    },
    req.baseUrl
  );
  return res.status(200).json(page);
}
export async function updateCategory(title, id) {
  const q = `
    UPDATE menu.categories
    SET title = $1
    WHERE id = $2
    RETURNING *
    `;

  try {
    const result = await query(q, [xss(title), id]);
    return result.rows[0];
  } catch (e) {
    console.error('Gat ekki uppfært category');
  }

  return null;
}
export async function deleteCategory(id) {
  const q = `
  DELETE FROM menu.categories
  WHERE id = $1
  RETURNING *;`;

  try {
    const result = await query(q, [id]);
    return result.rows[0];
  } catch (e) {
    console.error('Gat ekki eytt category');
  }

  return null;
}
export async function createCategory(title) {
  const q = `
    INSERT INTO
      menu.categories (title)
    VALUES ($1)
    RETURNING *
    `;

  try {
    const result = await query(q, [xss(title)]);
    return result.rows[0];
  } catch (e) {
    console.error('Gat ekki búið til category');
  }

  return null;
}

export async function findCategoryByTitle(title) {
  const q = 'SELECT * FROM menu.categories WHERE title = $1';

  try {
    const result = await query(q, [title]);

    if (result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (e) {
    console.error('Gat ekki fundið category eftir title');
    return null;
  }

  return false;
}
export async function findCategoryById(id) {
  const q = 'SELECT * FROM menu.categories WHERE id = $1';

  try {
    const result = await query(q, [id]);

    if (result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (e) {
    console.error('Gat ekki fundið category eftir id');
    return null;
  }

  return false;
}

export async function getCategory(_, req) {
  const { params: { id } = {} } = req;
  const category = await findCategoryById(id);
  return category;
}

export async function postCategoryRoute(req, res) {
  const { title } = req.body;

  const result = await createCategory(title);

  if (result) {
    return res.status(201).json(result);
  }

  return res.status(500).json({ error: 'Server error' });
}
export async function patchCategoryRoute(req, res) {
  const { id } = req.params;
  const { title } = req.body;

  const result = await updateCategory(title, id);

  if (result) {
    return res.status(200).json(result);
  }

  return res.status(500).json({ error: 'Server error' });
}
export async function deleteCategoryRoute(req, res) {
  const { id } = req.params;

  const result = await deleteCategory(id);

  if (result) {
    return res.status(204).json({});
  }

  return res.status(500).json({ error: 'Server error' });
}
