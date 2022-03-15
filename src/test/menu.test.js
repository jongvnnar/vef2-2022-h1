import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { createSchema, dropSchema, end } from '../lib/db';
import {
  postAndParse
} from './utils';

describe('menus', () => {
  beforeAll(async () => {
    await dropSchema();
    await createSchema();
  });

  afterAll(async () => {
    await end();
  });

  test('POST /menu creates a new menu item', async () => {
    const { result, status } = await postAndParse('/menu', null);

    expect(status).toBe(201);
    expect(result.id).toBeDefined();
  });
});
