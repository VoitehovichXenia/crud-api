import { createServer } from '../handlers/createServer';

const PORT: number = Number(process.argv?.find(item => item.startsWith('port='))?.replace('port=', '')) || 4000;

const server = createServer({ port: PORT, runningMessage: `Worker listening on http://localhost:${PORT}`, isWorker: true });

process.on('exit', () => server.close());
process.on('SIGINT', () => {
  server.close();
  process.exit(0);
});