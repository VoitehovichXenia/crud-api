import http, { IncomingMessage, ServerResponse } from 'http';
import { users } from './storage/users';

const server = http.createServer((request: IncomingMessage, response: ServerResponse) => {
  const method = request.method
  console.log(method, users)
  switch (method) {
    case 'GET':
      response.setHeader('Content-Type', 'application/json')
      response.statusCode = 200;

      response.end(JSON.stringify(users))
      break;
    default:
      console.log('default')
  }
});

server.listen(4000, 'localhost', () => {
  console.log('Server has been started')
});