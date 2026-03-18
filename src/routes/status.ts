import { FastifyInstance } from 'fastify';

export default async function (fastify: FastifyInstance, opts: any) {
  fastify.get('/status', async (request, reply) => {
    const status = fastify.db.getLatestStatus();
    const stats = fastify.db.getStats();

    // Merge stats with current status
    const monitored = status.map((s: any) => {
      const urlStats = stats.find((st: any) => st.url === s.url) || {};
      return {
        ...s,
        uptime_24h: urlStats.uptime || '100.00%',
        avg_latency_24h: Math.round(urlStats.avgLatency || 0) + 'ms',
        last_failure_at: urlStats.lastFailureAt || null
      };
    });

    return {
      service: 'HealthPing',
      timestamp: new Date().toISOString(),
      monitored_urls: monitored
    };
  });

  fastify.get('/api/stats', async (request, reply) => {
    return fastify.db.getStats();
  });
}
