export default async function (fastify, opts) {
  fastify.get('/status', async (request, reply) => {
    const status = fastify.db.getLatestStatus();
    return { 
      service: 'HealthPing',
      timestamp: new Date().toISOString(),
      monitored_urls: status 
    };
  });
}
