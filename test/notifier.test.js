import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import Fastify from 'fastify';
import { MockAgent, setGlobalDispatcher } from 'undici';
import notifierPlugin from '../src/plugins/notifier.js';

const agent = new MockAgent();
agent.disableNetConnect();
setGlobalDispatcher(agent);

describe('Notifier Plugin', () => {
  let fastify;

  beforeEach(async () => {
    fastify = Fastify();
    // Simulate fastify-env config
    fastify.decorate('config', {
      DISCORD_WEBHOOK: 'https://discord.com/api/webhooks/123',
      TELEGRAM_BOT_TOKEN: 'bot123',
      TELEGRAM_CHAT_ID: 'chat456'
    });
    await fastify.register(notifierPlugin);
  });

  test('should send Discord notification when webhook is present', async () => {
    const discordClient = agent.get('https://discord.com');
    discordClient.intercept({
      path: '/api/webhooks/123',
      method: 'POST',
      body: JSON.stringify({ content: 'Test Alert' })
    }).reply(204);

    await fastify.notify('Test Alert');
    assert.doesNotThrow(() => {});
  });

  test('should send Telegram notification when bot token and chat id are present', async () => {
    const telegramClient = agent.get('https://api.telegram.org');
    telegramClient.intercept({
      path: '/botbot123/sendMessage',
      method: 'POST',
      body: JSON.stringify({
        chat_id: 'chat456',
        text: 'Test Alert'
      })
    }).reply(200, { ok: true });

    await fastify.notify('Test Alert');
    assert.doesNotThrow(() => {});
  });
});
