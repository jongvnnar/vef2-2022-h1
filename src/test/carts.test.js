import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { createSchema, dropSchema, end, insertData } from '../lib/db';
import { deleteAndParse, fetchAndParse, patchAndParse, postAndParse } from './utils';

describe('carts', () => {
  beforeAll(async () => {
    await dropSchema();
    await createSchema();
  });

  afterAll(async () => {
    await end();
  });

  test('POST /cart creates a new cart', async () => {
    const { result, status } = await postAndParse('/cart', null);

    expect(status).toBe(201);
    expect(result.id).toBeDefined();
  });

  test('GET /cart/:cartid returns cart with lines', async () => {
    const { result: { id } } = await postAndParse('/cart', null);

    const { result, status } = await fetchAndParse(`/cart/${id}`);

    expect(status).toBe(200);
    expect(result.id).toBe(id);
    expect(Array.isArray(result.lines)).toBe(true);
  });

  test('GET /cart/:cartid returns cart with lines containing product details', async () => {
    await insertData();
    const { result: { id } } = await postAndParse('/cart', null);

    const line = {
      product: 1,
      quantity: 4
    };
    await postAndParse(`/cart/${id}`, line);

    const { result, status } = await fetchAndParse(`/cart/${id}`);

    const {lines} = result;

    expect(status).toBe(200);
    expect(lines[0].product_id).toBe(line.product);
    expect(lines[0].title).toBe('Vegan Peanut Steak');
    expect(lines[0].category).toBe(1);
    expect(lines[0].quantity).toBe(line.quantity);
    expect(lines[0].price).toBe(5390);
    expect(lines[0].total).toBe(5390 * line.quantity);
  });

  test('POST /cart/:cartid add line to a cart', async () => {
    await insertData();
    const { result: { id } } = await postAndParse('/cart', null);

    const line = {
      product: 1,
      quantity: 4
    };
    const { result, status } = await postAndParse(`/cart/${id}`, line);

    expect(status).toBe(201);
    expect(result.product_id).toBe(line.product);
    expect(result.cart_id).toBe(id);
    expect(result.quantity).toBe(line.quantity);
  });

  test('POST /cart/:cartid add line to a cart requires product', async () => {
    await insertData();
    const { result: { id } } = await postAndParse('/cart', null);

    const line = {
      quantity: 4
    };
    const { status } = await postAndParse(`/cart/${id}`, line);

    expect(status).toBe(400);
  });

  test('POST /cart/:cartid add line to a cart requires quantity', async () => {
    await insertData();
    const { result: { id } } = await postAndParse('/cart', null);

    const line = {
      product: 1
    };
    const { status } = await postAndParse(`/cart/${id}`, line);

    expect(status).toBe(400);
  });

  test('POST /cart/:cartid add line to a cart requires quantity to be a positive int', async () => {
    await insertData();
    const { result: { id } } = await postAndParse('/cart', null);

    const line = {
      product: 1,
      quantity: -4
    };
    const { status } = await postAndParse(`/cart/${id}`, line);

    expect(status).toBe(400);
  });

  test('POST /cart/:cartid add line to a cart requires product to be a positive int', async () => {
    await insertData();
    const { result: { id } } = await postAndParse('/cart', null);

    const line = {
      product: 'od',
      quantity: 4
    };
    const { status } = await postAndParse(`/cart/${id}`, line);

    expect(status).toBe(400);
  });

  test('DELETE /cart/:cartId deletes an existing cart', async () => {
    const { result: { id } } = await postAndParse('/cart', null);

    const { status } = await deleteAndParse(`/cart/${id}`, null);

    expect(status).toBe(204);
  });

  test('DELETE /cart/:cartId unable to delete non-existing cart', async () => {
    const id = 'f811f9d0-e860-41c4-adb9-e6339f404c24';

    const { status } = await deleteAndParse(`/cart/${id}`, null);

    expect(status).toBe(404);
  });

  test('GET /cart/:cartId/lines/:id returns a line in cart', async () => {
    await insertData();
    const { result: { id: cartId } } = await postAndParse('/cart', null);

    const line = {
      product: 1,
      quantity: 4
    };
    const { result: { id } } = await postAndParse(`/cart/${cartId}`, line);

    const { result, status } = await fetchAndParse(`/cart/${cartId}/line/${id}`);

    expect(status).toBe(200);
    expect(result.product_id).toBe(line.product);
    expect(result.title).toBe('Vegan Peanut Steak');
    expect(result.category).toBe(1);
    expect(result.quantity).toBe(line.quantity);
    expect(result.price).toBe(5390);
    expect(result.total).toBe(5390 * line.quantity);
  });

  test('PATCH /cart/:cartId/lines/:id updates a line\'s quantity', async () => {
    await insertData();
    const { result: { id: cartId } } = await postAndParse('/cart', null);

    const line = {
      product: 1,
      quantity: 4
    };
    const { result: { id } } = await postAndParse(`/cart/${cartId}`, line);

    const updatedLine = {
      quantity: 6
    };
    const { result, status } = await patchAndParse(`/cart/${cartId}/line/${id}`, updatedLine);

    expect(status).toBe(200);
    expect(result.id).toBe(id);
    expect(result.product_id).toBe(line.product);
    expect(result.cart_id).toBe(cartId);
    expect(result.quantity).toBe(updatedLine.quantity);
  });

  test('PATCH /cart/:cartId/lines/:id refuses to update if not valid quantity', async () => {
    await insertData();
    const { result: { id: cartId } } = await postAndParse('/cart', null);

    const line = {
      product: 1,
      quantity: 4
    };
    const { result: { id } } = await postAndParse(`/cart/${cartId}`, line);

    const updatedLine = {
      quantity: 'sdf'
    };
    const { status } = await patchAndParse(`/cart/${cartId}/line/${id}`, updatedLine);

    expect(status).toBe(400);
  });

  test('DELETE /cart/:cartId/lines/:id deletes line from cart', async () => {
    await insertData();
    const { result: { id: cartId } } = await postAndParse('/cart', null);

    const line = {
      product: 1,
      quantity: 4
    };
    const { result: { id } } = await postAndParse(`/cart/${cartId}`, line);

    const { status } = await deleteAndParse(`/cart/${cartId}/line/${id}`, null);

    expect(status).toBe(204);

    const { result } = await fetchAndParse(`/cart/${cartId}`);

    expect(result.lines.length).toBe(0);
  });
});
