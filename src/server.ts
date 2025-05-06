import http, { IncomingMessage, ServerResponse } from 'http';
import { validate } from 'uuid';
import { users } from './storage/users';

const USERS_ROUTE = '/api/users';

const server = http.createServer((request: IncomingMessage, response: ServerResponse) => {
  const url = request.url?.toLowerCase();
  const method = request.method;

  try {
    if (method === 'GET') {
      if (url === USERS_ROUTE) {
        response.setHeader('Content-Type', 'application/json');
        response.statusCode = 200;
        response.end(JSON.stringify(users));
      }
      else if (url?.startsWith(`${USERS_ROUTE}/`)) {
        const urlPathname = url.split('/');
        const userID = urlPathname[urlPathname.length - 1];
        const isIdValid = validate(userID);
        if (!isIdValid) {
          response.statusCode = 400;
          response.statusMessage = `User id: ${userID} is invalid`;
    
          response.end();
        }
  
        if (userID && isIdValid) {
          const user = users.find(userData => userData.id === userID);
          if (user) {
            response.setHeader('Content-Type', 'application/json');
            response.statusCode = 200;
      
            response.end(JSON.stringify(user));
          } else {
            response.statusCode = 404;
            response.statusMessage = `User with id: ${userID} doesn't exist`;
      
            response.end();
          }
        }
      }
    } else {
      response.statusCode = 404;
      response.statusMessage = `Not found`;
      response.end();
    }
  } catch {
    response.statusCode = 500;
    response.statusMessage = `Internal server error`;
    response.end();
  }
});

server.listen(4000, 'localhost', () => {
  console.log('Server has been started');
});