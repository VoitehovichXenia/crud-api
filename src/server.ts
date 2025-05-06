import http, { IncomingMessage, ServerResponse } from 'http';
import { validate, v4 as uuidv4, UUIDTypes } from 'uuid';
import { validateUserData } from './utils/validateUserData';

export type UserData = {
  id: UUIDTypes
  username: string
  age: number
  hobbies: string[] | []
}

let users: UserData[] = [
  {
    username: 'johndoe',
    id: uuidv4(),
    age: 27,
    hobbies: ['playing guitar', 'sining', 'gym']
  },
  {
    username: 'janedoe',
    id: uuidv4(),
    age: 42,
    hobbies: ['oil painting', 'stretching']
  },
  {
    username: 'roten_tomato',
    id: uuidv4(),
    age: 42,
    hobbies: ['cinematography', 'sining', 'swimming']
  },
  {
    username: 'fluffyemokitty',
    id: uuidv4(),
    age: 18,
    hobbies: ['sining', 'dancing']
  },
  {
    username: 'unique_diamond',
    id: uuidv4(),
    age: 20,
    hobbies: ['dancing']
  },
  {
    username: 'streetwalker',
    id: uuidv4(),
    age: 60,
    hobbies: []
  }
];

const USERS_ROUTE = '/api/users';

const server = http.createServer((request: IncomingMessage, response: ServerResponse) => {
  const url = request.url?.toLowerCase();
  const method = request.method;

  request.on('error', () => {
    response.statusCode = 500;
    response.statusMessage = `Internal server error`;
    response.end();
  })

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
    } else if (method === 'POST') {
      let body = '';
      request.on('data', chunk => {
        body += chunk;
      });

      if (url === USERS_ROUTE) {
        request.on('end', () => {
          try {

            const { username, age, hobbies } = JSON.parse(body);
            if (validateUserData({ username, age, hobbies })) {
              const id = uuidv4();
              const newUser: UserData = { id, username, age, hobbies };
              users.push(newUser);
              response.statusCode = 201;
              response.end(JSON.stringify(newUser));
            } else {
              response.statusCode = 400;
              response.statusMessage = 'New user data is incorrect';
              response.end();
            }
          } catch {
            response.statusCode = 404;
            response.statusMessage = `New user data JSON is incorrect`;
            response.end();
          }
        });
      } else {
        response.statusCode = 404;
        response.statusMessage = `Not found`;
        response.end();
      }
    } else if (method === 'PUT') {
      let body = '';
      request.on('data', chunk => {
        body += chunk;
      });

      if (url?.startsWith(`${USERS_ROUTE}/`)) {
        const urlPathname = url.split('/');
        const userID = urlPathname[urlPathname.length - 1];
        const isIdValid = validate(userID);
        if (!isIdValid) {
          response.statusCode = 400;
          response.statusMessage = `User id: ${userID} is invalid`;
    
          response.end();
        }
        request.on('end', () => {
          try {
            if (userID && isIdValid) {
              const user = users.find(userData => userData.id === userID);
              if (user) {
                const { username, age, hobbies } = JSON.parse(body)
                if (validateUserData({ username, age, hobbies })) {
                  const newUser = {
                    ...user,
                    username,
                    age,
                    hobbies
                  }
                  const index = users.findIndex(userData => userData.id === userID)
                  users[index] = newUser
                  response.setHeader('Content-Type', 'application/json');
                  response.statusCode = 201;
            
                  response.end(JSON.stringify(newUser));
                } else {
                  response.statusCode = 400;
                  response.statusMessage = `Update failed: new data is incorrect`;
            
                  response.end();
                }
              } else {
                response.statusCode = 404;
                response.statusMessage = `Update failed: JSON new data is incorrect`;
          
                response.end();
              }
            }
          } catch {
            response.statusCode = 404;
            response.statusMessage = `Not found`;
            response.end();
          }
        })
      }
    } else if (method === 'DELETE') {
      if (url?.startsWith(`${USERS_ROUTE}/`)) {
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
            users = users.filter(user => user.id !== userID)
            response.setHeader('Content-Type', 'application/json');
            response.statusCode = 204;
      
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