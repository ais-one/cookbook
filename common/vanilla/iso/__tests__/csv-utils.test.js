import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  arrayToCSVRow,
  csvToJson,
  jsonToCSVHeader,
  jsonToCSVRow,
  jsonToCsv,
  parseAndValidateCsv,
} from '../csv-utils.js';

describe.skip('csv-utils.js', () => {
  describe('arrayToCSVRow', () => {
    it('should convert array of primitives to CSV row', () => {
      assert.strictEqual(arrayToCSVRow([1, 'a', true]), '1,a,true');
    });

    it('should escape commas, quotes, and newlines in strings', () => {
      assert.strictEqual(arrayToCSVRow(['a,b', 'c"d', 'e\nf']), '"a,b","c""d","e\nf"');
    });

    it('should stringify and escape objects', () => {
      assert.strictEqual(arrayToCSVRow([{ x: 1, y: 'z' }]), '"{""x"":1,""y"":""z""}"');
    });

    it('should handle null and undefined as empty fields', () => {
      assert.strictEqual(arrayToCSVRow([null, undefined, 'foo']), ',,foo');
    });
  });

  describe('jsonToCSVHeader', () => {
    it('should convert object keys to CSV header', () => {
      assert.strictEqual(jsonToCSVHeader({ a: 1, b: 2 }), 'a,b');
    });
  });

  describe('jsonToCSVRow', () => {
    it('should convert object values to CSV row', () => {
      assert.strictEqual(jsonToCSVRow({ a: 1, b: 'foo' }), '1,foo');
    });

    it('should escape values as needed', () => {
      assert.strictEqual(jsonToCSVRow({ a: 'a,b', b: 'c"d' }), '"a,b","c""d"');
    });
  });

  describe('jsonToCsv', () => {
    it('should convert array of objects to CSV', () => {
      const arr = [
        { a: 1, b: 'foo' },
        { a: 2, b: 'bar' },
      ];
      assert.strictEqual(jsonToCsv(arr, ',', '\n', true), 'a,b\n1,foo\n2,bar\n');
    });

    it('should throw on column mismatch unless ignoreColumnMismatch is true', () => {
      const arr = [{ a: 1, b: 'foo' }, { a: 2 }];
      assert.throws(() => jsonToCsv(arr));
      assert.doesNotThrow(() => jsonToCsv(arr, ',', '\n', true));
    });

    it('should not add missing columns when ignoreColumnMismatch is true', () => {
      const arr = [{ a: 1, b: 'foo' }, { a: 2 }];
      assert.strictEqual(jsonToCsv(arr, ',', '\n', true), 'a,b\n1,foo\n2\n');
    });
  });

  describe('csvToJson', () => {
    it('should convert CSV to JSON array of objects', () => {
      const csv = 'a,b\n1,foo\n2,bar\n';
      const result = csvToJson({ _text: csv });
      assert.deepStrictEqual(result, [
        { a: '1', b: 'foo' },
        { a: '2', b: 'bar' },
      ]);
    });

    it('should handle quoted fields with commas and newlines', () => {
      const csv = 'a,b\n1,"hello, world"\n2,"line1\nline2"\n';
      const result = csvToJson({ _text: csv });
      assert.strictEqual(result[0].b, 'hello, world');
      assert.strictEqual(result[1].b, 'line1\nline2');
    });

    it('should throw on column mismatch unless ignoreColumnMismatch is true', () => {
      const csv = 'a,b\n1,2,3\n';
      assert.throws(() => csvToJson({ _text: csv }));
      assert.doesNotThrow(() => csvToJson({ _text: csv, ignoreColumnMismatch: true }));
    });
  });

  describe('parseAndValidateCsv', () => {
    it('should validate well-formed CSV', () => {
      const csv = 'a,b\n1,2\n3,4\n';
      const result = parseAndValidateCsv(csv);
      assert.strictEqual(result.valid, true);
      assert.deepStrictEqual(result.rows, [
        ['a', 'b'],
        ['1', '2'],
        ['3', '4'],
      ]);
    });

    it('should detect unclosed quotes', () => {
      const csv = 'a,b\n"1,2\n3,4\n';
      const result = parseAndValidateCsv(csv);
      assert.strictEqual(result.valid, false);
      assert.match(result.reason, /Unclosed quoted field/);
    });

    it('should detect corrupted JSON in fields', () => {
      const csv = 'a,b\n{"x":1},[1,2\n';
      const result = parseAndValidateCsv(csv);
      assert.strictEqual(result.valid, false);
      assert.match(result.reason, /Corrupted JSON/);
    });

    it('should validate JSON data', () => {
      const csv = 'a,b\n1,"{ ""aa"": ""123"" }"\n';
      const result = parseAndValidateCsv(csv);
      assert.strictEqual(result.valid, true);
      assert.deepStrictEqual(result.rows, [
        ['a', 'b'],
        ['1', '{ "aa": "123" }'],
      ]);
    });
  });
});
