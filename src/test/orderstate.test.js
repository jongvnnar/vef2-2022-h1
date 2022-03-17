import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { createSchema, dropSchema, end } from '../lib/db.js';
import { OrderState } from '../lib/order-state.js';
/**
 * OrderState enum
 */
describe('OrderState enum', () => {
  beforeAll(async () => {
    await dropSchema();
    await createSchema();
  });

  afterAll(async () => {
    await end();
  });

  const NEW = 'NEW';
  const PREPARE = 'PREPARE';
  const COOKING = 'COOKING';
  const READY = 'READY';
  const FINISHED = 'FINISHED';
  const UNAUTHORIZED_MESSAGE = 'Unauthorized state';
  test('has NEW state', () => {
    const result = OrderState.new.name;
    expect(result).toBe(NEW);
  });
  test('has PREPARE state', () => {
    const result = OrderState.prepare.name;
    expect(result).toBe(PREPARE);
  });
  test('has COOKING state', () => {
    const result = OrderState.cooking.name;
    expect(result).toBe(COOKING);
  });
  test('has READY state', () => {
    const result = OrderState.ready.name;
    expect(result).toBe(READY);
  });
  test('has FINISHED state', () => {
    const result = OrderState.finished.name;
    expect(result).toBe(FINISHED);
  });

  test('NEW goes to PREPARE state', () => {
    const result = OrderState.new.getNextState().name;
    expect(result).toBe(PREPARE);
  });
  test('PREPARE goes to COOKING state', () => {
    const result = OrderState.prepare.getNextState().name;
    expect(result).toBe(COOKING);
  });
  test('COOKING goes to READY state', () => {
    const result = OrderState.cooking.getNextState().name;
    expect(result).toBe(READY);
  });
  test('READY goes to FINISHED state', () => {
    const result = OrderState.ready.getNextState().name;
    expect(result).toBe(FINISHED);
  });
  test('Calling getNextState on FINISHED throws error', () => {
    expect(() => OrderState.finished.getNextState()).toThrow(
      'Attempt to reach unauthorized state'
    );
  });
  test('get state from string with NEW returns correctly', () => {
    const result = OrderState.fromString('NEW');
    expect(result.name).toBe(NEW);
  });
  test('get state from string with PREPARE returns correctly', () => {
    const result = OrderState.fromString('PREPARE');
    expect(result.name).toBe(PREPARE);
  });
  test('get state from string with COOKING returns correctly', () => {
    const result = OrderState.fromString('COOKING');
    expect(result.name).toBe(COOKING);
  });
  test('get state from string with READY returns correctly', () => {
    const result = OrderState.fromString('READY');
    expect(result.name).toBe(READY);
  });
  test('get state from string with FINISHED returns correctly', () => {
    const result = OrderState.fromString('FINISHED');
    expect(result.name).toBe(FINISHED);
  });
  test('get state from empty string throws', () => {
    expect(() => OrderState.fromString('')).toThrow(UNAUTHORIZED_MESSAGE);
  });
  test('get state from bullshit string throws', () => {
    expect(() => OrderState.fromString('aldkfslkdasjfl')).toThrow(
      UNAUTHORIZED_MESSAGE
    );
  });
});
