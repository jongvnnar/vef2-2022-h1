import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { createSchema, dropSchema, end, insertData } from '../lib/db';
import {
  createRandomUserAndReturnWithToken,
  fetchAndParse,
  loginAsHardcodedAdminAndReturnToken,
  postAndParse,
} from './utils';

describe('orders', () => {
  beforeAll(async () => {
    await dropSchema();
    await createSchema();
  });

  afterAll(async () => {
    await end();
  });

  test('GET /orders requires user', async () => {
    await insertData();
    const { status } = await fetchAndParse('/orders');

    expect(status).toBe(401);
  });

  test('GET /orders requires admin user', async () => {
    await insertData();
    const { token } = await createRandomUserAndReturnWithToken();
    const { status } = await fetchAndParse('/orders', token);

    expect(status).toBe(401);
  });

  test('GET /orders returns page of orders', async () => {
    await insertData();
    const token = await loginAsHardcodedAdminAndReturnToken();
    const { result, status } = await fetchAndParse('/orders', token);

    expect(status).toBe(200);
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items[0].id).toBeDefined();
    expect(result.items[0].name).toBeDefined();
    expect(result.items[0].current_state).toBeDefined();
  });

  test('POST /orders requires existing cart', async () => {
    await insertData();
    const order = {
      name: 'test-order',
      cart: 'f811f9d0-e860-41c4-adb9-e6339f404cr7',
    };

    const { status } = await postAndParse('/orders', order);

    expect(status).toBe(400);
  });

  test('POST /orders creates a new order', async () => {
    await insertData();
    const order = {
      name: 'test-order',
      cart: 'f811f9d0-e860-41c4-adb9-e6339f404c27',
    };

    const { result, status } = await postAndParse('/orders', order);

    expect(status).toBe(201);
    expect(result.id).toBeDefined();
    expect(result.current_state).toBe('NEW');
  });

  test('GET /orders/:id returns order', async () => {
    await insertData();

    const { result, status } = await fetchAndParse(
      '/orders/b9e8ba22-96ea-4ef7-8c52-272fad6d76f1'
    );

    expect(status).toBe(200);
    expect(result.id).toBeDefined();
    expect(result.name).toBeDefined();
    expect(result.current_state).toBeDefined();

    const { lines, status: orderStatus } = result;

    expect(lines.length).toBeGreaterThan(0);
    expect(lines[0].product_id).toBeDefined();
    expect(lines[0].title).toBeDefined();
    expect(lines[0].description).toBeDefined();
    expect(lines[0].image).toBeDefined();
    expect(lines[0].category).toBeDefined();
    expect(lines[0].quantity).toBeDefined();
    expect(lines[0].price).toBeDefined();
    expect(lines[0].total).toBe(lines[0].quantity * lines[0].price);

    expect(orderStatus.length).toBeGreaterThan(0);
  });

  test('GET /orders/:id/status returns order status', async () => {
    await insertData();

    const { result, status } = await fetchAndParse(
      '/orders/b9e8ba22-96ea-4ef7-8c52-272fad6d76f1/status'
    );

    expect(status).toBe(200);
    expect(result.length).toBeGreaterThan(0);
    expect(result[result.length - 1].state).toBe('NEW');
  });

  test('POST /orders/:id/status requires user', async () => {
    await insertData();

    const newState = {
      status: 'PREPARE',
    };

    const { status } = await postAndParse(
      '/orders/e7b2a445-aa01-4166-b675-d4c0934b32b0/status',
      newState
    );

    expect(status).toBe(401);
  });

  test('POST /orders/:id/status requires admin user', async () => {
    await insertData();
    const { token } = await createRandomUserAndReturnWithToken();

    const newState = {
      status: 'PREPARE',
    };

    const { status } = await postAndParse(
      '/orders/e7b2a445-aa01-4166-b675-d4c0934b32b0/status',
      newState,
      token
    );

    expect(status).toBe(401);
  });

  test('POST /orders/:id/status updates order if next state is inserted', async () => {
    await insertData();
    const token = await loginAsHardcodedAdminAndReturnToken();

    const newState = {
      status: 'COOKING',
    };

    const { status } = await postAndParse(
      '/orders/e7b2a445-aa01-4166-b675-d4c0934b32b0/status',
      newState,
      token
    );

    expect(status).toBe(400);
  });

  test('POST /orders/:id/status updates order state', async () => {
    await insertData();
    const token = await loginAsHardcodedAdminAndReturnToken();

    const newState = {
      status: 'PREPARE',
    };

    const { result, status } = await postAndParse(
      '/orders/e7b2a445-aa01-4166-b675-d4c0934b32b0/status',
      newState,
      token
    );

    expect(status).toBe(200);
    expect(result.current_state).toBe(newState.status);
  });
});
