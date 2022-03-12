import { pagedQuery } from "../../lib/db.js";

export async function listMenuItems(req, res) {
  const { offset = 0, limit = 10 } = req.query;
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
