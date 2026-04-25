import assert from 'node:assert/strict';

import { describe, it } from 'node:test';

import { emptyObjects, isEmptyObject, isValidObject } from '../util.js';

describe('util.js', () => {
  describe('isEmptyObject', () => {
    it('returns true for a plain empty object', () => {
      assert.strictEqual(isEmptyObject({}), true);
    });

    it('returns false for a plain object with keys', () => {
      assert.strictEqual(isEmptyObject({ a: 1 }), false);
      assert.strictEqual(isEmptyObject({ a: undefined }), false);
    });

    it('returns false for non-plain-object inputs', () => {
      assert.strictEqual(isEmptyObject(null), null);
      assert.strictEqual(isEmptyObject([]), false);
      assert.strictEqual(isEmptyObject(''), '');
      assert.strictEqual(isEmptyObject('text'), false);
      assert.strictEqual(isEmptyObject(0), 0);
      assert.strictEqual(isEmptyObject(123), false);
      assert.strictEqual(isEmptyObject(false), false);
      assert.strictEqual(isEmptyObject(true), false);
      assert.strictEqual(
        isEmptyObject(() => {}),
        false,
      );
      assert.strictEqual(isEmptyObject(new Date()), false);

      const noPrototypeObject = Object.create(null);
      assert.strictEqual(isEmptyObject(noPrototypeObject), false);
    });
  });

  describe('isValidObject', () => {
    it('returns true for plain objects', () => {
      assert.strictEqual(isValidObject({}), true);
      assert.strictEqual(isValidObject({ a: 1 }), true);
    });

    it('returns false for non-plain-object inputs', () => {
      assert.strictEqual(isValidObject(null), null);
      assert.strictEqual(isValidObject([]), false);
      assert.strictEqual(isValidObject(''), '');
      assert.strictEqual(isValidObject('text'), false);
      assert.strictEqual(isValidObject(0), 0);
      assert.strictEqual(isValidObject(123), false);
      assert.strictEqual(isValidObject(false), false);
      assert.strictEqual(isValidObject(true), false);
      assert.strictEqual(
        isValidObject(() => {}),
        false,
      );
      assert.strictEqual(isValidObject(new Date()), false);

      const noPrototypeObject = Object.create(null);
      assert.strictEqual(isValidObject(noPrototypeObject), false);
    });
  });

  describe('emptyObjects', () => {
    it('is an alias of isEmptyObject', () => {
      assert.strictEqual(emptyObjects, isEmptyObject);
    });

    it('preserves isEmptyObject behavior', () => {
      assert.strictEqual(emptyObjects({}), true);
      assert.strictEqual(emptyObjects({ a: 1 }), false);
    });
  });
});
