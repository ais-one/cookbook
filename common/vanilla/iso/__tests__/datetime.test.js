import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  dateStrAddDay,
  dateStrAddDayISO,
  getDayOfWeek,
  getLocaleDateISO,
  getLocaleDateTimeTzISO,
  getLocaleTimeISO,
  getTzOffsetISO,
  getYmdhmsUtc,
} from '../datetime.js';

describe.skip('datetime.js', () => {
  describe('dateStrAddDay', () => {
    it('should add days to ISO date string and return [YYYY, MM, DD]', () => {
      const result = dateStrAddDay('2023-01-01T00:00:00Z', 2);
      assert.deepStrictEqual(result, ['2023', '01', '03']);
    });
    it('should default to 0 days', () => {
      const result = dateStrAddDay('2023-01-01T00:00:00Z');
      assert.deepStrictEqual(result, ['2023', '01', '01']);
    });
  });

  describe('dateStrAddDayISO', () => {
    it('should add days and return ISO string', () => {
      const result = dateStrAddDayISO('2023-01-01T00:00:00Z', 1);
      assert.ok(result.startsWith('2023-01-02'));
    });
    it('should default to 0 days', () => {
      const result = dateStrAddDayISO('2023-01-01T00:00:00Z');
      assert.ok(result.startsWith('2023-01-01'));
    });
  });

  describe('getLocaleDateTimeTzISO', () => {
    it('should return formatted date-time with timezone', () => {
      const dt = '2023-10-24T11:40:15Z';
      const tz = 'Asia/Singapore';
      const result = getLocaleDateTimeTzISO(dt, tz);
      assert.match(result, /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} GMT\+8/);
    });
  });

  describe('getLocaleDateISO', () => {
    it('should return local date in ISO format', () => {
      const dt = '2023-10-24T11:40:15Z';
      const tz = 'Asia/Singapore';
      const result = getLocaleDateISO(dt, tz);
      assert.match(result, /\d{4}-\d{2}-\d{2}/);
    });
  });

  describe('getLocaleTimeISO', () => {
    it('should return local time in ISO format', () => {
      const dt = '2023-10-24T11:40:15Z';
      const tz = 'Asia/Singapore';
      const result = getLocaleTimeISO(dt, tz);
      assert.match(result, /\d{2}:\d{2}:\d{2}/);
    });
  });

  describe('getTzOffsetISO', () => {
    it('should return timezone offset in ISO format', () => {
      const date = new Date('2023-01-01T00:00:00Z');
      const result = getTzOffsetISO(date);
      assert.match(result, /^[+-]\d{2}:\d{2}$/);
    });
    it('should default to current date', () => {
      const result = getTzOffsetISO();
      assert.match(result, /^[+-]\d{2}:\d{2}$/);
    });
  });

  describe('getYmdhmsUtc', () => {
    it('should return UTC timestamp in YYYYMMDD_HHmmssZ format', () => {
      const date = new Date('2023-01-01T12:34:56Z');
      const result = getYmdhmsUtc(date);
      assert.strictEqual(result, '20230101_123456Z');
    });
    it('should default to current date', () => {
      const result = getYmdhmsUtc();
      assert.match(result, /\d{8}_\d{6}Z/);
    });
  });

  describe('getDayOfWeek', () => {
    it('should return correct day index for UTC', () => {
      const date = '2023-01-01T00:00:00Z'; // Sunday
      const result = getDayOfWeek(date);
      assert.strictEqual(result, 0);
    });
    it('should return correct day index for timezone', () => {
      const date = '2023-01-01T00:00:00Z';
      const tz = 'Asia/Singapore';
      const result = getDayOfWeek(date, tz);
      assert.ok(result >= 0 && result <= 6);
    });
  });
});
