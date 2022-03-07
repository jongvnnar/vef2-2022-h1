import express from 'express';
import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

export const router = express.Router();

async function getIndexRoute(req, res) {
  const path = dirname(fileURLToPath(import.meta.url));
  const indexJson = await readFile(join(path, './index.json'));
  res.json(JSON.parse(indexJson));
}

router.get('/', getIndexRoute);
