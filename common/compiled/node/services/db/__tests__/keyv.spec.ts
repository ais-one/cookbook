export {};

const assert = require('node:assert/strict');
const { describe, it, beforeEach, afterEach } = require('node:test');

const StoreKeyV = require('../keyv');

describe('StoreKeyV (keyv wrapper)', () => {
  // biome-ignore lint/suspicious/noImplicitAnyLet: test fixture assigned in beforeEach
  let store;

  beforeEach(() => {
    store = new StoreKeyV();
    store.open();
  });

  afterEach(() => {
    store.close();
  });

  it('should open a keyv instance and allow set/get', async () => {
    const kv = store.get();
    assert.ok(kv, 'keyv instance should be available');

    await kv.set('test-key', 'value');
    const got = await kv.get('test-key');
    assert.strictEqual(got, 'value');
  });

  it('should clear internal reference on close', () => {
    store.close();
    assert.strictEqual(store.get(), null);
  });
});
