import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import xss from 'xss';
import { query } from '../lib/db.js';

dotenv.config();

const { BCRYPT_ROUNDS: bcryptRounds = 1 } = process.env;

export async function comparePasswords(password, hash) {
  const result = await bcrypt.compare(password, hash);
  return result;
}

export async function findByEmail(email) {
  const q = 'SELECT * FROM users WHERE email = $1';

  try {
    const result = await query(q, [xss(email)]);

    if (result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (e) {
    console.error('Gat ekki fundið notanda eftir notendnafni');
    return null;
  }

  return false;
}

export async function findByUsername(username) {
  const q = 'SELECT * FROM users WHERE username = $1';

  try {
    const result = await query(q, [xss(username)]);

    if (result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (e) {
    console.error('Gat ekki fundið notanda eftir notendnafni');
    return null;
  }

  return false;
}

export async function findById(id) {
  const q = 'SELECT * FROM users WHERE id = $1';

  try {
    const result = await query(q, [id]);

    if (result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (e) {
    console.error('Gat ekki fundið notanda eftir id');
  }

  return null;
}

export async function createUser(name, username, email, password) {
  // Geymum hashað password!
  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(bcryptRounds, 10)
  );
  const q = `
    INSERT INTO
      users (name, username,email, password)
    VALUES ($1, $2, $3,$4)
    RETURNING *
  `;

  try {
    const result = await query(q, [
      xss(name),
      xss(username),
      xss(email),
      hashedPassword,
    ]);
    return result.rows[0];
  } catch (e) {
    console.error('Gat ekki búið til notanda');
  }

  return null;
}

export async function conditionalUpdateUser(id, values) {
  if (values.length === 0) return null;
  const { email = '', password = '', username = '', name = '' } = values;
  let hashedPassword = '';
  if (password) {
    hashedPassword = await bcrypt.hash(password, parseInt(bcryptRounds, 10));
  }

  //https://medium.com/developer-rants/conditional-update-in-postgresql-a27ddb5dd35
  const q = `
  UPDATE users SET
  name = COALESCE(NULLIF($1, ''), name),
  email = COALESCE(NULLIF($2, ''), email),
  username = COALESCE(NULLIF($3, ''), username),
  password = COALESCE(NULLIF($4, ''), password)
  WHERE id = $5
  RETURNING name, email, username;
  `;
  const vals = [xss(name), xss(email), xss(username), hashedPassword, xss(id)];
  try {
    const result = await query(q, vals);
    return result.rows[0];
  } catch (e) {
    console.error('Gat ekki uppfært notanda');
  }

  return null;
}

//TODO REMOVE?
export async function listUsers() {
  const q = `
  SELECT id, name, email, username, admin FROM users ORDER BY id ASC;
  `;

  try {
    const result = await query(q);
    return result.rows;
  } catch (e) {
    console.error('Gat ekki fundið lista af notendum');
  }
  return null;
}
