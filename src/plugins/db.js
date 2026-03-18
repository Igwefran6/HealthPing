import fp from 'fastify-plugin';
import { JSONFilePreset } from 'lowdb/node';

async function dbPlugin(fastify, opts) {
  // Initialize lowdb with a default structure
  const defaultData = { pings: [] };
  const db = await JSONFilePreset('db.json', defaultData);

  // Helper to record a ping
  const recordPing = async (data) => {
    const { url, success, statusCode, error, responseTime } = data;
    const newPing = {
      url,
      success,
      statusCode,
      error: error || null,
      responseTime,
      timestamp: new Date().toISOString()
    };

    // Keep only the last 1000 pings to prevent the file from growing indefinitely
    db.data.pings.push(newPing);
    if (db.data.pings.length > 1000) {
      db.data.pings.shift();
    }
    
    await db.write();
  };

  // Helper to get latest status
  const getLatestStatus = () => {
    const latest = {};
    // Group by URL and get the most recent result for each
    [...db.data.pings].reverse().forEach(ping => {
      if (!latest[ping.url]) {
        latest[ping.url] = ping;
      }
    });
    return Object.values(latest);
  };

  fastify.decorate('db', { recordPing, getLatestStatus, data: db.data });
}

export default fp(dbPlugin);
