import fp from 'fastify-plugin';
import { request } from 'undici';
import { FastifyInstance } from 'fastify';

async function notifierPlugin(fastify: FastifyInstance, opts: any) {
  const notify = async (message: string) => {
    const { DISCORD_WEBHOOK, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = fastify.config;
    let sent = false;

    // Discord Integration
    if (DISCORD_WEBHOOK) {
      try {
        await request(DISCORD_WEBHOOK, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ content: message })
        });
        fastify.log.info('Discord alert sent.');
        sent = true;
      } catch (err: any) {
        fastify.log.error(`Discord alert failed: ${err.message}`);
      }
    }

    // Telegram Integration
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
        sent = true;
      } catch (err: any) {
        fastify.log.error(`Telegram alert failed: ${err.message}`);
      }
    }

    // Dummy/Fallback Integration
    if (!sent) {
      fastify.log.info(`[DUMMY NOTIFIER] Alert: ${message}`);
      fastify.log.info('Hint: Set DISCORD_WEBHOOK or TELEGRAM_BOT_TOKEN in .env for real alerts.');
    }
  };

  fastify.decorate('notify', notify);
}

// Typing for the decorated fastify instance
declare module 'fastify' {
  interface FastifyInstance {
    notify: (message: string) => Promise<void>;
  }
}

export default fp(notifierPlugin);
