import jwt from 'jsonwebtoken';
import { jwtOptions, tokenOptions } from '../../auth/passport.js';
import {
  conditionalUpdateUser,
  createUser,
  findByEmail,
  findById,
  findByUsername,
} from '../../auth/users.js';
import { pagedQuery, query } from '../../lib/db.js';
import { addPageMetadata } from '../../lib/utils/addPageMetadata.js';

export async function listUsersRoute(req, res) {
  const { offset = 0, limit = 10 } = req.query;
  const q = `
  SELECT id, name, username, admin
  FROM users
  ORDER BY id ASC
  `;
  const users = await pagedQuery(q, [], { offset, limit });
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
  const { name, username, email, password = '' } = req.body;

  const result = await createUser(name, username, email, password);

  delete result.password;

  return res.status(201).json(result);
}

export async function loginRoute(req, res) {
  const { username, email } = req.body;

  const user = username
    ? await findByUsername(username)
    : await findByEmail(email);

  if (!user) {
    console.error('Unable to find user', username || email);
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
  delete user?.password;
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

// TODO
export async function updateCurrentUserRoute(req, res) {
  const { user: { id } = {} } = req;
  const result = await conditionalUpdateUser(id, req.body);
  if (result) {
    return res.status(200).json(result);
  }
  return res.status(500).json({ 'Server error': 'Unable to update user' });
}

export async function updateUserRoute(req, res) {
  const {
    body: { admin } = {},
    params: { id },
    user,
  } = req;
  if (user.id === parseInt(id, 10)) {
    return res.status(400).json({ error: 'admin cannot change self' });
  }
  try {
    const updatedUser = await query(
      `
        UPDATE
          users
        SET
          admin = $1
        WHERE
          id = $2
        RETURNING
          id, username, email, admin
      `,
      [admin, id]
    );
    if (updatedUser.rowCount === 1) {
      return res.status(200).json(updatedUser.rows[0]);
    } throw new Error('unable to update user');
  } catch (e) {
    console.error(`unable to change admin to "${admin}" for user "${id}"`, e);
  }

  return res.status(500).json(null);
}
