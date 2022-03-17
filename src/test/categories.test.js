import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { createSchema, dropSchema, end, insertData } from '../lib/db';
import { createRandomUserAndReturnWithToken, fetchAndParse, loginAsHardcodedAdminAndReturnToken, postAndParse } from './utils';

describe('categories', () => {
  beforeAll(async () => {
    await dropSchema();
    await createSchema();
  });

  afterAll(async () => {
    await end();
  });

  test('GET /categories returns all categories', async () => {
    await insertData();
    const { result, status } = await fetchAndParse('/categories');

    expect(status).toBe(200);
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items[0].id).toBeDefined();
    expect(result.items[0].title).toBeDefined();
  });
  // loginashardcodedadmin() return 201

  // loginasrandomuser() return 401
  test('post /categories requires user', async () => {
    const { status } = await postAndParse('/categories', null, null);

    expect(status).toBe(401);
  });

  test('post /categories requires admin user', async () => {
    await insertData();
    const { token } = await createRandomUserAndReturnWithToken();
    const { status } = await postAndParse('/categories', null, token);

    expect(status).toBe(401);
  });

  test('post /categories creates a new category', async () => {
    await insertData();
    const token = await loginAsHardcodedAdminAndReturnToken();
    const newCategory = {
      title: 'test category',
    };
    const { result, status } = await postAndParse('/categories', newCategory, token);

    expect(status).toBe(201);
    expect(result.id).toBeDefined();
  });
  /*

  test('patch /categories/:Id updates a category title', async () => {
    await insertData();
    const token = await loginAsHardcodedAdminAndReturnToken();
    const newCategoryTitle = {
      title: 'new Title category',
      id: '1',
    };

    const { result, status } = await patchAndParse('/categories', newCategoryTitle, token);

    expect(status).toBe(201);
    expect(result.id).toBe(newCategoryTitle.id);
    expect(result.title).toBe(newCategoryTitle.title);


  });
  */

  // post category without user - return 401

  //
});


