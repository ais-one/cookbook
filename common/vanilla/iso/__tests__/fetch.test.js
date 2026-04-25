import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';
import Fetch from '../fetch.js';

function createFetchMock() {
  const calls = [];
  const responses = [];
  const fn = async (...args) => {
    calls.push(args);
    const res = responses.shift();
    if (!res) throw new Error('No mock response configured');
    return res;
  };

  fn.calls = calls;
  fn.mockResolvedValueOnce = value => {
    responses.push(value);
    return fn;
  };
  fn.mockResolvedValue = value => {
    responses.length = 0;
    responses.push(value);
    return fn;
  };
  fn.mockClear = () => {
    calls.length = 0;
    responses.length = 0;
  };
  return fn;
}

describe.skip('fetch.js', () => {
  let originalFetch;
  let fetchInstance;
  let fetchMock;

  beforeEach(() => {
    originalFetch = global.fetch;
    fetchMock = createFetchMock();
    global.fetch = fetchMock;
    fetchInstance = new Fetch();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('constructor', () => {
    it('should set default options and tokens', () => {
      assert.strictEqual(fetchInstance.options.baseUrl, '');
      assert.strictEqual(fetchInstance.options.credentials, 'same-origin');
      assert.strictEqual(typeof fetchInstance.options.forceLogoutFn, 'function');
      assert.strictEqual(fetchInstance.options.refreshUrl, '');
      assert.strictEqual(fetchInstance.options.timeoutMs, 0);
      assert.strictEqual(fetchInstance.options.maxRetry, 0);
      assert.deepStrictEqual(fetchInstance.tokens, { access: '', refresh: '' });
    });

    it('should override options and tokens', () => {
      const options = { baseUrl: 'http://localhost', timeoutMs: 5000 };
      const tokens = { access: 'token123', refresh: 'refresh123' };
      fetchInstance = new Fetch(options, tokens);
      assert.strictEqual(fetchInstance.options.baseUrl, 'http://localhost');
      assert.strictEqual(fetchInstance.options.timeoutMs, 5000);
      assert.strictEqual(fetchInstance.tokens.access, 'token123');
      assert.strictEqual(fetchInstance.tokens.refresh, 'refresh123');
    });
  });

  describe('parseUrl', () => {
    it('should parse relative URL', () => {
      const result = Fetch.parseUrl('/api/test', 'http://localhost');
      assert.deepStrictEqual(result, {
        urlOrigin: 'http://localhost',
        urlPath: '/api/test',
        urlFull: 'http://localhost/api/test',
        urlSearch: '',
      });
    });

    it('should parse absolute URL with query', () => {
      const result = Fetch.parseUrl('http://localhost/api/test?key=value');
      assert.deepStrictEqual(result, {
        urlOrigin: 'http://localhost',
        urlPath: '/api/test',
        urlFull: 'http://localhost/api/test',
        urlSearch: '?key=value',
      });
    });

    it('should handle invalid URL', () => {
      const result = Fetch.parseUrl('invalid-url', 'http://localhost');
      assert.strictEqual(result.urlOrigin, 'http://localhost');
      assert.strictEqual(result.urlPath, 'invalid-url');
      assert.strictEqual(result.urlFull, 'http://localhostinvalid-url');
      assert.strictEqual(result.urlSearch, '');
    });
  });

  describe('setOptions and getOptions', () => {
    it('should set and get options', () => {
      fetchInstance.setOptions({ baseUrl: 'http://test.com' });
      assert.strictEqual(fetchInstance.getOptions().baseUrl, 'http://test.com');
    });
  });

  describe('setTokens and getTokens', () => {
    it('should set and get tokens', () => {
      fetchInstance.setTokens({ access: 'newtoken' });
      assert.strictEqual(fetchInstance.getTokens().access, 'newtoken');
    });
  });

  describe('http', () => {
    it('should make a successful GET request', async () => {
      fetchMock.mockResolvedValueOnce({
        status: 200,
        text: () => Promise.resolve('{"data": "test"}'),
      });

      const result = await fetchInstance.http('GET', 'http://localhost/api/test');
      assert.strictEqual(result.status, 200);
      assert.deepStrictEqual(result.data, { data: 'test' });
      assert.strictEqual(fetchMock.calls.length, 1);
      assert.strictEqual(fetchMock.calls[0][0], 'http://localhost/api/test');
      assert.strictEqual(fetchMock.calls[0][1].method, 'GET');
    });

    it('should handle query parameters', async () => {
      fetchMock.mockResolvedValueOnce({
        status: 200,
        text: () => Promise.resolve(''),
      });

      await fetchInstance.http('GET', 'http://localhost/api/test', null, { key: 'value' });
      assert.strictEqual(fetchMock.calls[0][0], 'http://localhost/api/test?key=value');
    });

    it('should handle POST with JSON body', async () => {
      fetchMock.mockResolvedValueOnce({
        status: 201,
        text: () => Promise.resolve(''),
      });

      await fetchInstance.http('POST', 'http://localhost/api/test', { name: 'test' });
      assert.strictEqual(fetchMock.calls[0][0], 'http://localhost/api/test');
      assert.strictEqual(fetchMock.calls[0][1].method, 'POST');
      assert.strictEqual(fetchMock.calls[0][1].body, '{"name":"test"}');
      assert.strictEqual(fetchMock.calls[0][1].headers['Content-Type'], 'application/json');
    });

    it('should handle POST with URL-encoded body', async () => {
      fetchMock.mockResolvedValueOnce({
        status: 201,
        text: () => Promise.resolve(''),
      });
      await fetchInstance.http('POST', 'http://localhost/api/test', { name: 'test' }, null, {
        'Content-Type': 'application/x-www-form-urlencoded',
      });
      assert.strictEqual(fetchMock.calls[0][0], 'http://localhost/api/test');
      assert.strictEqual(fetchMock.calls[0][1].method, 'POST');
      assert.strictEqual(fetchMock.calls[0][1].body.toString(), 'name=test');
      assert.strictEqual(fetchMock.calls[0][1].headers['Content-Type'], 'application/x-www-form-urlencoded');
    });

    it('should handle POST with octet-stream', async () => {
      fetchMock.mockResolvedValueOnce({ status: 201, text: () => Promise.resolve('') });

      const binaryData = new Uint8Array(Buffer.from('Hello', 'utf-8'));
      await fetchInstance.http('POST', 'http://localhost/api/test', binaryData, null, {
        'Content-Type': 'application/octet-stream',
      });
      assert.strictEqual(fetchMock.calls[0][0], 'http://localhost/api/test');
      assert.strictEqual(fetchMock.calls[0][1].method, 'POST');
      assert.strictEqual(fetchMock.calls[0][1].body.toString(), binaryData.toString());
      assert.strictEqual(fetchMock.calls[0][1].headers['Content-Type'], 'application/octet-stream');
    });

    it('should handle FormData body', async () => {
      const formData = new FormData();
      formData.append('file', 'test');
      fetchMock.mockResolvedValueOnce({ status: 200, text: () => Promise.resolve('') });
      await fetchInstance.http('POST', 'http://localhost/api/test', formData);
      assert.strictEqual(fetchMock.calls[0][0], 'http://localhost/api/test');
      assert.strictEqual(fetchMock.calls[0][1].method, 'POST');
      assert.strictEqual(fetchMock.calls[0][1].body, formData);
    });

    it('should handle 401 with token refresh', async () => {
      fetchMock.mockResolvedValueOnce({
        status: 401,
        text: () => Promise.resolve('{"message": "Token Expired Error"}'),
      });
      fetchMock.mockResolvedValueOnce({
        status: 200,
        text: () => Promise.resolve('{"access_token": "new_access", "refresh_token": "new_refresh"}'),
      });
      fetchMock.mockResolvedValueOnce({
        status: 200,
        text: () => Promise.resolve('{"data": "success"}'),
      });

      fetchInstance.setOptions({ refreshUrl: '/refresh' });
      fetchInstance.setTokens({ access: 'old_access', refresh: 'old_refresh' });

      const result = await fetchInstance.http('GET', 'http://127.0.0.1/api/test');
      assert.strictEqual(result.status, 200);
      assert.deepStrictEqual(result.data, { data: 'success' });
      assert.strictEqual(fetchInstance.tokens.access, 'new_access');
      assert.strictEqual(fetchMock.calls.length, 3);
      assert.strictEqual(fetchMock.calls[1][0], 'http://127.0.0.1/refresh');
    });

    it('should throw when token refresh fails', { only: false }, async () => {
      fetchMock.mockResolvedValueOnce({
        status: 401,
        text: () => Promise.resolve('{"message": "Token Expired Error"}'),
      });
      fetchMock.mockResolvedValueOnce({ status: 404, text: () => Promise.resolve('{"message": "error"}') });
      fetchInstance.setOptions({ refreshUrl: '/refresh' });
      fetchInstance.setTokens({ access: 'old_access', refresh: 'old_refresh' });

      await assert.rejects(
        async () => {
          await fetchInstance.http('GET', 'http://localhost/api/test');
        },
        err => {
          assert.strictEqual(err.status, 404);
          assert.deepStrictEqual(err.data, { message: 'error' });
          return true;
        },
      );
      assert.strictEqual(fetchInstance.tokens.access, 'old_access');
      assert.strictEqual(fetchMock.calls.length, 2);
    });

    it('should throw on error status', async () => {
      fetchMock.mockResolvedValueOnce({ status: 404, text: () => Promise.resolve('') });
      await assert.rejects(async () => {
        await fetchInstance.http('GET', 'http://localhost/api/test');
      });
    });

    it('should call forceLogoutFn on 401/403 without token error', async () => {
      let logoutCalled = false;
      fetchInstance.setOptions({
        forceLogoutFn: () => {
          logoutCalled = true;
        },
      });
      fetchMock.mockResolvedValueOnce({
        status: 401,
        text: () => Promise.resolve('{"message": "Unauthorized"}'),
      });

      await assert.rejects(async () => {
        await fetchInstance.http('GET', 'http://localhost/api/test');
      });
      assert.strictEqual(logoutCalled, true);
    });
  });

  describe('convenience methods', () => {
    beforeEach(() => {
      fetchMock.mockResolvedValue({
        status: 200,
        text: () => Promise.resolve(''),
      });
    });

    it('should call http with correct method for get', async () => {
      await fetchInstance.get('/api/test');
      assert.strictEqual(fetchMock.calls[0][1].method, 'GET');
    });

    it('should call http with correct method for post', async () => {
      await fetchInstance.post('/api/test', { data: 'test' });
      assert.strictEqual(fetchMock.calls[0][1].method, 'POST');
    });

    it('should call http with correct method for put', async () => {
      await fetchInstance.put('/api/test', { data: 'test' });
      assert.strictEqual(fetchMock.calls[0][1].method, 'PUT');
    });

    it('should call http with correct method for patch', async () => {
      await fetchInstance.patch('/api/test', { data: 'test' });
      assert.strictEqual(fetchMock.calls[0][1].method, 'PATCH');
    });

    it('should call http with correct method for del', async () => {
      await fetchInstance.del('/api/test');
      assert.strictEqual(fetchMock.calls[0][1].method, 'DELETE');
    });
  });
});
