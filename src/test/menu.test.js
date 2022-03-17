import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { createSchema, dropSchema, end, insertData } from '../lib/db';
import {
  deleteAndParse,
  fetchAndParse,
  loginAsHardcodedAdminAndReturnToken,
  patchAndParse,
  postAndParse
} from './utils';

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
    const { status } = await postAndParse('/menu', null);
    expect(status).toBe(401);
  });

  test('POST /menu/ add item to menu requires body', async () => {
    const body = {
      title: 'post test',
      price: 12345,
      description: 'post about',
      category: 1
    }
    const token = await loginAsHardcodedAdminAndReturnToken();
    const imagePath = './test.jpg'
    const { result, status } = await postAndParse('/menu', body, token, imagePath);
    expect(status).toBe(201);
    expect(result.title).toBe('post test')
    expect(result.price).toBe(12345)
    expect(result.description).toBe('post about')
    expect(result.category).toBe(1)

  });

  test('GET /menu/ get items in category 1', async () => {
    const { result, status } = await fetchAndParse('/menu?category=1', null);
    expect(status).toBe(200);
    expect(result.items[0].category).toBe(1);
  });

  test('GET /menu/ get items invalid category', async () => {
    const { result, status } = await fetchAndParse('/menu?category=0', null);
    expect(status).toBe(200);
    expect(result.items.length).toBe(0);
  });

  test('GET /menu/ get items containing search query', async () => {
    const { result, status } = await fetchAndParse(
      '/menu?search=EkkiTil',
      null
    );
    expect(status).toBe(200);
    expect(result.items.length).toBe(0);
  });

  test('GET /menu/ no items found with search', async () => {
    const { result, status } = await fetchAndParse('/menu?search=Vegan', null);
    expect(status).toBe(200);
    expect(result.items[0].id).toBe(1);
    expect(result.items[0].title).toBe('Vegan Peanut Steak');
    expect(result.items[0].price).toBe(5390);
    expect(result.items[0].category).toBe(1);
  });

  test('GET /menu/ both search and category', async () => {
    const { result, status } = await fetchAndParse(
      '/menu?category=1&search=Vegan',
      null
    );
    expect(status).toBe(200);
    expect(result.items[0].id).toBe(1);
    expect(result.items[0].title).toBe('Vegan Peanut Steak');
    expect(result.items[0].price).toBe(5390);
    expect(result.items[0].category).toBe(1);
  });

  test('GET /menu/1 get item with id 1', async () => {
    const { result, status } = await fetchAndParse('/menu/1', null);
    expect(status).toBe(200);
    expect(result.id).toBe(1);
    expect(result.title).toBe('Vegan Peanut Steak');
    expect(result.price).toBe(5390);
    expect(result.category).toBe(1);
  });

  test('GET /menu/1 get item with invalid id', async () => {
    const { status } = await fetchAndParse('/menu/0', null);
    expect(status).toBe(400);
  });

  test('PATCH /menu/1 no body', async () => {
    const { status } = await patchAndParse('/menu/1', null);
    expect(status).toBe(401);
  });

  test('PATCH /menu/1 update title of item 1', async () => {
    const body = { title: 'new title' };
    const token = await loginAsHardcodedAdminAndReturnToken();
    const { result, status } = await patchAndParse('/menu/1', body, token);
    expect(status).toBe(200);
    expect(result.title).toBe('new title');
  });

  test('PATCH /menu/1 update multiple values of item 1', async () => {
    const body = {
      title: 'test title',
      price: 12345,
      description: 'test',
      category: 2,
    };
    const token = await loginAsHardcodedAdminAndReturnToken();
    const { result, status } = await patchAndParse('/menu/1', body, token);
    expect(status).toBe(200);
    expect(result.title).toBe('test title');
    expect(result.price).toBe(12345);
    expect(result.description).toBe('test');
    expect(result.category).toBe(2);
  });

  test('Delete /menu/1 delete item 1', async () => {
    const token = await loginAsHardcodedAdminAndReturnToken();
    const { status } = await deleteAndParse('/menu/1', null, token);
    expect(status).toBe(204);
  });

  test('Delete /menu/1 no auth', async () => {
    const { status } = await deleteAndParse('/menu/1', null);
    expect(status).toBe(401);
  });

  test('Delete /menu/1 invalid id', async () => {
    const token = await loginAsHardcodedAdminAndReturnToken();
    const { status } = await deleteAndParse('/menu/0', null, token);
    expect(status).toBe(404);
  });
});
