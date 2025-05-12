import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';
import { resolve } from 'node:path';
import { spawn } from 'node:child_process';
import dotenv from 'dotenv';
import { Users } from '../storage/users';
dotenv.config();

const PORT: number = Number(process.env.PORT) || 4000;
const CPUS: number = availableParallelism();

const LOAD_BALANCER_PATH: string = resolve(process.cwd(), './src/cluster/loadBalancer.ts');
const WORKER_PATH: string = resolve(process.cwd(), './src/cluster/worker.ts');

if (cluster.isPrimary) {
  spawn(
    'ts-node',
    ['--transpile-only', LOAD_BALANCER_PATH, `port=${PORT.toString()}`],
    {
      stdio: 'inherit',
      shell: true,
    }
  );
 
  for (let i = 1; i < CPUS; i++) {
    const workerPort = PORT + i;
    spawn(
      'ts-node',
      ['--transpile-only', WORKER_PATH, `port=${workerPort.toString()}`],
      {
        stdio: 'inherit',
        shell: true,
      }
    );
  }

  process.on('exit', async () => await Users.clear());
  process.on('SIGINT', async () => {
    await Users.clear();
    process.exit(0);
  });
}