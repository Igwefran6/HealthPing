import { test, describe } from 'node:test';
import assert from 'node:assert';
import { MockAgent, setGlobalDispatcher } from 'undici';
import { ping } from '../src/services/pinger.js';

const agent = new MockAgent();
agent.disableNetConnect();
setGlobalDispatcher(agent);

describe('Pinger Service', () => {
  const mockUrl = 'https://example.com';
  const client = agent.get('https://example.com');

  test('should return success: true when status code is 200', async () => {
    client.intercept({
      path: '/',
      method: 'GET',
    }).reply(200, 'OK');

    const result = await ping(mockUrl);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.statusCode, 200);
  });

  test('should return success: false when status code is 500', async () => {
    client.intercept({
      path: '/',
      method: 'GET',
    }).reply(500, 'Internal Server Error');

    const result = await ping(mockUrl);
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.statusCode, 500);
    assert.match(result.error, /Status code: 500/);
  });

  test('should return success: false on network failure', async () => {
    client.intercept({
      path: '/',
      method: 'GET',
    }).replyWithError(new Error('Network connectivity issue'));

    const result = await ping(mockUrl);
    assert.strictEqual(result.success, false);
    assert.match(result.error, /Network connectivity issue/);
  });
});
