import http, { IncomingMessage, ServerResponse } from 'http';
import { validate, v4 as uuidv4, UUIDTypes } from 'uuid';
import { validateUserData } from './utils/validateUserData';
import { handleResponse } from './handlers/handleResponse';
import dotenv from 'dotenv';
dotenv.config();

export type UserData = {
  id: UUIDTypes
  username: string
  age: number
  hobbies: string[] | []
}

export let users: UserData[] = [];

const USERS_ROUTE = '/api/users';

export const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  const url = req.url?.toLowerCase();
  const method = req.method;

  try {
    if (url === USERS_ROUTE) {
      if (method === 'GET') {
        handleResponse({
          res,
          statusCode: 200,
          data: JSON.stringify(users)
        });
      } else if (method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          try {
            const { username, age, hobbies } = JSON.parse(body);
            if (validateUserData({ username, age, hobbies })) {
              const id = uuidv4();
              const newUser: UserData = { id, username, age, hobbies };
              users.push(newUser);
              handleResponse({
                res,
                statusCode: 201,
                data: JSON.stringify(newUser)
              });
            } else {
              handleResponse({ res, statusCode: 400, statusMessage: 'User data is invalid' });
            }
          } catch {
            handleResponse({ res, statusCode: 404, statusMessage: 'JSON user data is incorrect' });
          }
        });
      } else {
        handleResponse({ res, statusCode: 404, statusMessage: `${method} method is not supported on the ${url} route` });
      }
    } else if (url?.startsWith(`${USERS_ROUTE}/`)) {
      const urlPath = url.split('/');
      if (urlPath.length !== 4) throw new Error(`404: Requested route ${url} doesn't exist`);
      const userID = urlPath[urlPath.length - 1];
      const isIdValid = validate(userID);
      if (!isIdValid) {
        handleResponse({ res, statusCode: 400, statusMessage: `User id ${userID} is invalid` });
      }

      let body = '';
      req.on('data', chunk => { body += chunk; });

      if (method === 'GET' && userID && isIdValid) {
        const user = users.find(userData => userData.id === userID);
        if (user) {
          handleResponse({
            res,
            statusCode: 200,
            data: JSON.stringify(user)
          });
        } else {
          handleResponse({ res, statusCode: 400, statusMessage: `User with id ${userID} doesn't exist` });
        }
      } else if (method === 'PUT' && userID && isIdValid) {
        req.on('end', () => {
          try {
            const user = users.find(userData => userData.id === userID);
            if (user) {
              const { username, age, hobbies } = JSON.parse(body);
              if (validateUserData({ username, age, hobbies })) {
                const newUser = { ...user, username, age, hobbies };
                const index = users.findIndex(userData => userData.id === userID);
                users[index] = newUser;

                handleResponse({
                  res,
                  statusCode: 201,
                  data: JSON.stringify(newUser)
                });
              } else {
                handleResponse({
                  res,
                  statusCode: 400,
                  statusMessage: 'User data is invalid'
                });
              }
            } else {
              handleResponse({ res, statusCode: 404, statusMessage: `User with id: ${userID} doesn't exist` });
            }
          } catch {
            handleResponse({ res, statusCode: 404, statusMessage: 'JSON user data is incorrect' });
          }
        });
      } else if (method === 'DELETE' && userID && isIdValid) {
        const user = users.find(userData => userData.id === userID);
        if (user) {
          users = users.filter(user => user.id !== userID);
          handleResponse({ res, statusCode: 204 });
        } else {
          handleResponse({ res, statusCode: 404, statusMessage: `User with id: ${userID} doesn't exist` });
        }
      } else {
        handleResponse({ res, statusCode: 404, statusMessage: `${method} method is not supported on the ${url} route` });
      }
    } else {
      handleResponse({ res, statusCode: 404, statusMessage: `Requested route ${url} doesn't exist` });
    }
  } catch (err) {
    if ((err as { message: string })?.message?.startsWith('404:')) {
      handleResponse({ res, statusCode: 404, statusMessage: (err as { message: string }).message.replace('404: ', '') });
    } else {
      handleResponse({ res, statusCode: 500, statusMessage: `Internal server error: ${(err as { message: string }).message}` });
    }
  }
});

if (require.main === module) {
  server.listen(Number(process.env.PORT), 'localhost', () => {
    console.log(`Server has been started on http://localhost:${process.env.PORT}`);
  });
}
