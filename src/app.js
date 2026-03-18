import Fastify from 'fastify';
import fastifyEnv from '@fastify/env';
import fastifyAutoload from '@fastify/autoload';
import cron from 'node-cron';
import { schema } from './config/schema.js';
import { ping } from './services/pinger.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty'
    }
  }
});

const start = async () => {
  try {
    // 1. Register config
    await fastify.register(fastifyEnv, {
      schema,
      dotenv: true
    });

    // 2. Register plugins from directory
    await fastify.register(fastifyAutoload, {
      dir: path.join(__dirname, 'plugins')
    });

    // 3. Register routes from directory
    await fastify.register(fastifyAutoload, {
      dir: path.join(__dirname, 'routes')
    });

    // 4. Set up ping job
    const urls = fastify.config.URL_LIST.split(',').map(u => u.trim());
    
    cron.schedule(fastify.config.PING_INTERVAL, async () => {
      const startTime = new Date().toISOString();
      fastify.log.info(`[${startTime}] Starting ping cycle for ${urls.length} URLs...`);
      
      await Promise.all(urls.map(async (url) => {
        try {
          const result = await ping(url);
          // Record result in DB
          await fastify.db.recordPing(result);

          if (!result.success) {
            const message = `🚨 HealthPing Alert [${new Date().toISOString()}]: ${url} is DOWN! Error: ${result.error}`;
            fastify.log.warn(message);
            await fastify.notify(message);
          } else {
            fastify.log.info(`✅ ${url} is UP (${result.statusCode}) - ${result.responseTime}ms`);
          }
        } catch (err) {
          fastify.log.error(`Unexpected error pinging ${url}: ${err.message}`);
        }
      }));
    });

    // 5. Start the server
    await fastify.listen({ port: fastify.config.PORT, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
