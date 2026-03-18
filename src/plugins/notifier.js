import fp from 'fastify-plugin';
import { request } from 'undici';

async function notifierPlugin(fastify, opts) {
  const notify = async (message) => {
    const { DISCORD_WEBHOOK, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = fastify.config;

    if (DISCORD_WEBHOOK) {
      try {
        await request(DISCORD_WEBHOOK, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ content: message })
        });
        fastify.log.info('Discord alert sent.');
      } catch (err) {
        fastify.log.error(`Discord alert failed: ${err.message}`);
      }
    }

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        await request(url, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message
          })
        });
        fastify.log.info('Telegram alert sent.');
      } catch (err) {
        fastify.log.error(`Telegram alert failed: ${err.message}`);
      }
    }
  };

  fastify.decorate('notify', notify);
}

export default fp(notifierPlugin);
