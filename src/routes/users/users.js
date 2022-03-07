import jwt from 'jsonwebtoken';
import { jwtOptions, tokenOptions } from '../../auth/passport.js';
import { createUser, findById, findByUsername } from '../../auth/users.js';
import { pagedQuery } from '../../lib/db.js';
import { addPageMetadata } from '../../lib/utils/addPageMetadata.js';

export async function listUsersRoute(req, res) {
  const { offset = 0, limit = 10 } = req.query;
  const query = `
  SELECT id, name, username, admin
  FROM users
  ORDER BY id ASC
  `;
  const users = await pagedQuery(query, [], { offset, limit });
  const page = addPageMetadata(
    users,
    req.path,
    {
      offset,
      limit,
      length: users.items.length,
    },
    req.baseUrl
  );
  return res.status(200).json(page);
}

export async function registerRoute(req, res) {
  const { name, username, password = '' } = req.body;

  const result = await createUser(name, username, password);

  delete result.password;

  return res.status(201).json(result);
}

export async function loginRoute(req, res) {
  const { username } = req.body;

  const user = await findByUsername(username);

  if (!user) {
    console.error('Unable to find user', username);
    return res.status(500).json({});
  }

  const payload = { id: user.id };
  const token = jwt.sign(payload, jwtOptions.secretOrKey, tokenOptions);
  delete user.password;

  return res.json({
    user,
    token,
    expiresIn: tokenOptions.expiresIn,
  });
}

export async function listUser(userId) {
  const user = await findById(userId);
  delete user.password;
  return user;
}

export async function currentUserRoute(req, res) {
  const { user: { id } = {} } = req;

  const user = await findById(id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  delete user.password;

  return res.json(user);
}
