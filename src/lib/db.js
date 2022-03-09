import { readFile } from 'fs/promises';
import pg from 'pg';
import { toPositiveNumberOrDefault } from './utils/toPositiveNumberOrDefault.js';

const SCHEMA_FILE = './sql/schema.sql';
const DROP_SCHEMA_FILE = './sql/drop.sql';
const INSERT_DATA_FILE = './sql/insert.sql';

const { DATABASE_URL: connectionString, NODE_ENV: nodeEnv = 'development' } =
  process.env;

if (!connectionString) {
  console.error('vantar DATABASE_URL í .env');
  process.exit(-1);
}

// Notum SSL tengingu við gagnagrunn ef við erum *ekki* í development
// mode, á heroku, ekki á local vél
const ssl = nodeEnv === 'production' ? { rejectUnauthorized: false } : false;

const pool = new pg.Pool({ connectionString, ssl });

pool.on('error', (err) => {
  console.error('Villa í tengingu við gagnagrunn, forrit hættir', err);
  process.exit(-1);
});

/**
 * @typedef {Object} Category
 * @property {number} id - ID of category
 * @property {string} title - Title of category
 */

/**
 * @typedef {Object} Product
 * @property {number} id - ID of product
 * @property {string} title - product title
 * @property {number} price - price of product
 * @property {string} description - product description
 * @property {string} image - image url
 * @property {number} category - ID of category
 * @property {Date} created - time of creation
 * @property {Date} updated - time product was last updated
 */

/**
 * @typedef {Object} Cart
 * @property {string} id - ID of cart
 * @property {Date} created - time of creation
 */

/**
 * @typedef {Object} Line
 * @property {number} product_id - ID of product
 * @property {string} cart_id - ID of cart
 * @property {number} num_of_products - number of products
 */

/**
 * @typedef {Object} Order
 * @property {string} id - ID of order
 * @property {Date} created - time of creation
 * @property {string} name - order name
 */

export async function query(q, values = []) {
  let client;
  try {
    client = await pool.connect();
  } catch (e) {
    console.error('unable to get client from pool', e);
    return null;
  }

  try {
    const result = await client.query(q, values);
    return result;
  } catch (e) {
    if (nodeEnv !== 'test') {
      console.error('unable to query', e);
    }
    return null;
  } finally {
    client.release();
  }
}

export async function pagedQuery(
  sqlQuery,
  values = [],
  { offset = 0, limit = 10 } = {}
) {
  const sqlLimit = values.length + 1;
  const sqlOffset = values.length + 2;
  const q = `${sqlQuery} LIMIT $${sqlLimit} OFFSET $${sqlOffset}`;

  const limitAsNumber = toPositiveNumberOrDefault(limit, 10);
  const offsetAsNumber = toPositiveNumberOrDefault(offset, 0);

  const combinedValues = values.concat([limitAsNumber, offsetAsNumber]);

  const result = await query(q, combinedValues);

  return {
    limit: limitAsNumber,
    offset: offsetAsNumber,
    items: result.rows,
  };
}

export async function createSchema(schemaFile = SCHEMA_FILE) {
  const data = await readFile(schemaFile);

  return query(data.toString('utf-8'));
}

export async function dropSchema(dropFile = DROP_SCHEMA_FILE) {
  const data = await readFile(dropFile);

  return query(data.toString('utf-8'));
}

export async function insertData(insertFile = INSERT_DATA_FILE) {
  const data = await readFile(insertFile);
  const insert = await query(data.toString('utf-8'));
  return insert;
}

export async function end() {
  await pool.end();
}
