export const schema = {
  type: 'object',
  required: ['PORT', 'URL_LIST'],
  properties: {
    PORT: {
      type: 'string',
      default: '3000'
    },
    URL_LIST: {
      type: 'string',
      default: 'https://google.com, https://github.com'
    },
    PING_INTERVAL: {
      type: 'string',
      default: '*/5 * * * *' // Every 5 minutes
    },
    DISCORD_WEBHOOK: {
      type: 'string'
    },
    TELEGRAM_BOT_TOKEN: {
      type: 'string'
    },
    TELEGRAM_CHAT_ID: {
      type: 'string'
    }
  }
};

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      PORT: number;
      URL_LIST: string;
      PING_INTERVAL: string;
      DISCORD_WEBHOOK?: string;
      TELEGRAM_BOT_TOKEN?: string;
      TELEGRAM_CHAT_ID?: string;
    };
  }
}
