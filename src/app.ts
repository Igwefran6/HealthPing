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
    const urls = fastify.config.URL_LIST.split(',').map((u) => u.trim());

    cron.schedule(fastify.config.PING_INTERVAL, async () => {
      const startTime = new Date().toISOString();
      fastify.log.info(`[${startTime}] Starting ping cycle for ${urls.length} URLs...`);

      await Promise.all(
        urls.map(async (url) => {
          try {
            // Use 2 retries (total 3 attempts) for reliability
            const result = await ping(url, 2);

            // Record result in DB
            await fastify.db.recordPing(result);

            if (!result.success) {
              const message = `🚨 HealthPing Alert [${new Date().toISOString()}]: ${url} is DOWN! Error: ${result.error} (after ${result.attempt} attempts)`;
              fastify.log.warn(message);
              await fastify.notify(message);
            } else {
              const retryInfo = result.attempt > 1 ? ` (recovered on attempt ${result.attempt})` : '';
              fastify.log.info(
                `✅ ${url} is UP (${result.statusCode}) - ${result.responseTime}ms${retryInfo}`
              );
            }
          } catch (err: any) {
            fastify.log.error(`Unexpected error pinging ${url}: ${err.message}`);
          }
        })
      );
    });

    // 5. Graceful Shutdown
    const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
    signals.forEach((signal) => {
      process.on(signal, async () => {
        fastify.log.info(`Received ${signal}, closing server...`);
        try {
          await fastify.close();
          fastify.log.info('Server closed gracefully');
          process.exit(0);
        } catch (err: any) {
          fastify.log.error(`Error during graceful shutdown: ${err.message}`);
          process.exit(1);
        }
      });
    });

    // 6. Start the server
    await fastify.listen({ port: fastify.config.PORT, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
