import { availableParallelism } from 'node:os';
import { IncomingMessage, ServerResponse, createServer, request } from 'node:http';

const PORT: number = Number(process.argv?.find(item => item.startsWith('port='))?.replace('port=', '')) || 4000;
const CPUS: number = availableParallelism();

const workersPorts = Array.from({ length: CPUS - 1 }, (_, i) => PORT + i + 1);
let currentServerIndex = 0;

const server = createServer((clientReq: IncomingMessage, clientRes: ServerResponse) => {
  const targetPort = workersPorts[currentServerIndex];
  currentServerIndex = (currentServerIndex + 1) % workersPorts.length;

  const proxyReqOpt = {
    hostname: 'localhost',
    path: clientReq.url,
    headers: clientReq.headers,
    port: targetPort,
    method: clientReq.method
  };

  const proxy = request(
    proxyReqOpt,
    (proxyRes: IncomingMessage): void => {
      console.log(`${clientReq.method}: goes to http://localhost:${targetPort}`);
      clientRes.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
      proxyRes.pipe(clientRes, { end: true });
    }
  );

  clientReq.pipe(proxy, { end: true });

  proxy.on('error', () => {
    console.log('PROXY ERR:', `Request ${clientReq.method} to http://localhost:${targetPort} has failed`);
    clientRes.writeHead(500);
    clientRes.end();
  });
});

server.listen(PORT, 'localhost', () => {
  console.log(`Load balancer listening on http://localhost:${PORT}`);
});
