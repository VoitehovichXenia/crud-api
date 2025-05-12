import { createServer as HTTPCreateServer, Server } from 'node:http';
import { handleServerRequest } from './handleServerRequest';
import { Users } from '../storage/users';

type CreateServerProps = {
  port: number
  runningMessage?: string
  isTestMode?: boolean
  isWorker?: boolean
}

export const createServer = ({ port, runningMessage, isTestMode, isWorker }: CreateServerProps): Server => {
  const server = HTTPCreateServer(handleServerRequest);

  if (!isTestMode) {
    server.listen(port, 'localhost', () => {
      console.log(runningMessage);
    });

    if (!isWorker) {   
      const handleProcessTerm = async () => {
        await Users.clear();
        server.close();
        process.exit(0);
      };

      process.on('SIGINT', handleProcessTerm);
      process.on('SIGTERM', handleProcessTerm);
    }

  }


  return server;
};