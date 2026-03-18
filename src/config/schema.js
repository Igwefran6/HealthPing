export const schema = {
  type: 'object',
  required: ['PORT'],
  properties: {
    PORT: {
      type: 'integer',
      default: 3000
    },
    PING_INTERVAL: {
      type: 'string',
      default: '*/5 * * * *', // Every 5 minutes
      pattern: '^[^\\s]+(\\s+[^\\s]+){4}$' // Simple cron format validation
    },
    URL_LIST: {
      type: 'string',
      default: 'https://google.com,https://github.com'
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
