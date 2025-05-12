import { IncomingMessage, ServerResponse } from 'http';
import { validate, UUIDTypes } from 'uuid';
import { handleResponse } from './handleResponse';
import { Users } from '../storage/users';
import { validateUserData } from '../utils/validateUserData';
import { handleErrors } from './handleErrors';

export type UserData = {
  id: UUIDTypes
  username: string
  age: number
  hobbies: string[] | []
}

const USERS_ROUTE = '/api/users';

export const handleServerRequest = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  const url = req.url?.toLowerCase();
  const method = req.method;
  
  try {
    if (url === USERS_ROUTE) {
      if (method === 'GET') {
        const data = await Users.getAll();
        if (data) {
          handleResponse({ res, statusCode: 200, data: JSON.stringify(data) });
        } else throw new Error('404');
        return;
      }

      if (method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const { username, age, hobbies } = JSON.parse(body);
            if (validateUserData({ username, age, hobbies })) {
              const newUser = await Users.add({ username, age, hobbies });
              if (newUser) {
                handleResponse({
                  res,
                  statusCode: 201,
                  data: JSON.stringify(newUser)
                });
              }
            } else throw new Error('400: User data is invalid');
          } catch (err) {
            handleErrors(
              (err as { message: string }).message.startsWith('400:')
                ? 400
                : 500,
              (err as { message: string }).message,
              res
            );
          }
        });
        return;
      }

      handleResponse({ res, statusCode: 404, statusMessage: `Route ${method} ${url} doesn't exist` });
      return;
    }
    
    if (url?.startsWith(`${USERS_ROUTE}/`)) {
      const urlPath = url.split('/');
      if (urlPath.length !== 4) throw new Error(`404: Requested route ${method} ${url} doesn't exist`);
      const userID = urlPath[urlPath.length - 1];
      const isIdValid = validate(userID);
      if (!isIdValid) {
        handleResponse({ res, statusCode: 400, statusMessage: `User id ${userID} is invalid` });
        return;
      }

      let body = '';
      req.on('data', chunk => { body += chunk; });

      if (method === 'GET' && userID && isIdValid) {
        const data = await Users.get(userID);
        if (data) {
          handleResponse({ res, statusCode: 200, data: JSON.stringify(data) });
        } else {
          handleResponse({ res, statusCode: 404, statusMessage: `User with id ${userID} doesn't exist` });
        }
        return;
      } 

      if (method === 'PUT' && userID && isIdValid) {
        req.on('end', async () => {
          try {
            const { username, age, hobbies } = JSON.parse(body);
            if (validateUserData({ username, age, hobbies })) {
              const updatedUser = await Users.update(userID, { username, age, hobbies });
              if (updatedUser) {
                handleResponse({ res, statusCode: 201, data: JSON.stringify(updatedUser) });
              } else {
                handleResponse({ res, statusCode: 404, statusMessage: `User with id: ${userID} doesn't exist` });
              }
            } else throw new Error();
          } catch {
            handleResponse({ res, statusCode: 400, statusMessage: 'User data is invalid' });
          }
        });
        return;
      }

      if (method === 'DELETE' && userID && isIdValid) {
        const isUserDeleted = await Users.delete(userID);
        if (isUserDeleted) {
          handleResponse({ res, statusCode: 204 });
        } else {
          handleResponse({ res, statusCode: 404, statusMessage: `User with id: ${userID} doesn't exist` });
        }
        return;
      }

      handleResponse({ res, statusCode: 404, statusMessage: `Requested route ${method} ${url} doesn't exist` });
      return;
    }

    handleResponse({ res, statusCode: 404, statusMessage: `Requested route ${method} ${url} doesn't exist` });
    return;
  } catch (err) {
    handleErrors(
      (err as { message: string }).message.startsWith('404:')
        ? 404
        : 500,
      (err as { message: string }).message,
      res
    );
  }
};