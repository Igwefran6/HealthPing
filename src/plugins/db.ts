import fp from 'fastify-plugin';
import initSqlJs from 'sql.js';
import fs from 'fs/promises';
import path from 'path';
import { FastifyInstance } from 'fastify';
import { PingResult } from '../services/pinger.js';

interface PingStats {
  url: string;
  total: number;
  successful: number;
  avgLatency: number;
  uptime: string;
  lastFailureAt: string | null;
}

async function dbPlugin(fastify: FastifyInstance, opts: any) {
  const DB_PATH = path.join(process.cwd(), 'healthping.sqlite');

  // Load existing DB from file or create new
  let dbBuffer: Uint8Array | null = null;
  try {
    const data = await fs.readFile(DB_PATH);
    dbBuffer = new Uint8Array(data);
  } catch (err) {
    dbBuffer = null;
  }

  const SQL = await initSqlJs();
  const db = new SQL.Database(dbBuffer);

  // Initialize Schema
  db.run(`
    CREATE TABLE IF NOT EXISTS pings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT NOT NULL,
      success INTEGER NOT NULL,
      statusCode INTEGER,
      error TEXT,
      responseTime INTEGER,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Helper to save DB to file
  const persist = async () => {
    const data = db.export();
    const buffer = Buffer.from(data);
    await fs.writeFile(DB_PATH, buffer);
  };

  // Helper to record a ping
  const recordPing = async (data: PingResult) => {
    const { url, success, statusCode, error, responseTime } = data;

    db.run(
      'INSERT INTO pings (url, success, statusCode, error, responseTime) VALUES (?, ?, ?, ?, ?)',
      [url, success ? 1 : 0, statusCode || null, error || null, responseTime]
    );

    await persist();
  };

  // Helper to get latest status
  const getLatestStatus = () => {
    const res = db.exec(`
      SELECT url, success, statusCode, error, responseTime, timestamp
      FROM pings
      WHERE id IN (SELECT MAX(id) FROM pings GROUP BY url)
    `);

    if (res.length === 0) return [];

    const columns = res[0].columns;
    return res[0].values.map((row) => {
      const obj: any = {};
      columns.forEach((col, i) => {
        obj[col] = row[i];
      });
      obj.success = obj.success === 1;
      return obj;
    });
  };

  // Helper for 24h stats
  const getStats = (): PingStats[] => {
    const res = db.exec(`
      SELECT 
        url,
        COUNT(*) as total,
        SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful,
        AVG(responseTime) as avgLatency,
        MAX(CASE WHEN success = 0 THEN timestamp ELSE NULL END) as lastFailureAt
      FROM pings
      WHERE timestamp >= datetime('now', '-1 day')
      GROUP BY url
    `);

    if (res.length === 0) return [];

    const columns = res[0].columns;
    return res[0].values.map((row) => {
      const obj: any = {};
      columns.forEach((col, i) => {
        obj[col] = row[i];
      });
      // Improved uptime: if we have no successful pings but total > 0, it's 0%
      // If we just started, it might be misleading, but it's technically correct for the data we have.
      obj.uptime = obj.total > 0 
        ? ((obj.successful / obj.total) * 100).toFixed(2) + '%'
        : '100.00%';
      return obj;
    });
  };

  fastify.decorate('db', { recordPing, getLatestStatus, getStats });

  // Clean up on close
  fastify.addHook('onClose', async () => {
    await persist();
    db.close();
  });
}

// Typing for the decorated fastify instance
declare module 'fastify' {
  interface FastifyInstance {
    db: {
      recordPing: (data: PingResult) => Promise<void>;
      getLatestStatus: () => any[];
      getStats: () => PingStats[];
    };
  }
}

export default fp(dbPlugin);
