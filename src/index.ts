import { createServer } from './handlers/createServer';

const PORT = Number(process.env.PORT) || 4000;

createServer({ port: PORT, runningMessage: `Server is listening on http://localhost:${PORT}` });
