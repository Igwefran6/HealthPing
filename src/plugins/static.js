import path from 'path';
import { fileURLToPath } from 'url';
import fastifyStatic from '@fastify/static';
import fp from 'fastify-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function staticPlugin(fastify, opts) {
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../public'),
    prefix: '/', // serve at root
  });
}

export default fp(staticPlugin);
