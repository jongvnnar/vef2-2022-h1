import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { createSchema, dropSchema, end, insertData } from '../lib/db';
import { fetchAndParse, postAndParse } from './utils';

describe('menus', () => {
  beforeAll(async () => {
    await dropSchema();
    await createSchema();
    await insertData();
  });

  afterAll(async () => {
    await end();
  });

  test('GET /menu gets all menu items', async () => {
    const { result, status } = await fetchAndParse('/menu', null);

    expect(status).toBe(200);
    expect(result.limit).toBe(10);
    expect(result.offset).toBe(0);
    // console.log(result.items)
    // expect(result.items[0].id).toBe(1);
    // expect(result.items[0].title).toBe('Vegan Peanut Steak');
    // expect(result.items[0].price).toBe(5390);
    expect(result.items[0].category).toBe(1);
  });
  test('POST /menu/ add item to menu requires body', async () => {
    // await insertData();
    const id = 1
    const { status } = await postAndParse(`/menu/${id}`, null);

    expect(status).toBe(400);
  });
});
