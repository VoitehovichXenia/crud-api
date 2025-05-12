# Simple CRUD API

&nbsp;&nbsp;&nbsp;&nbsp;This application implements simple CRUD API with in-memory database for users data.

## CONTENTS

1. [Technologies stack](#technologies-stack)
2. [Prerequesties](#prerequesties)
3. [Get started](#get-started)
4. [API Documentation:](#api-documentation)
    - [GET: /api/users](#get-apiusers)
    - [GET: /api/users/{:id}](#get-apiusersid)
    - [POST /api/users](#post-apiusers)
    - [PUT /api/users/{:id}](#put-apiusersid)
    - [DELETE /api/users/{:id}](#delete-apiusersid)
    - [GENERAL STATUS CODES](#general-status-codes)
5.

## Technologies stack

&nbsp;&nbsp;&nbsp;&nbsp;Typescript

## Prerequesties

&nbsp;&nbsp;&nbsp;&nbsp;Node >= 22.14.0, npm or yarn of compatible version

## Get started

&nbsp;&nbsp;&nbsp;&nbsp;To run an application please follow next steps:

1. Clone this repository:

```
git clone https://github.com/VoitehovichXenia/crud-api.git
```

2. Go to the root directory and install required dependencies:

```
npm install
```

or if you're using ``yarn``:

```
yarn install
```

3. After all dependencies will be installed, you can run application

- in a development mode:
   ```
   npm run start:dev
  ```
- in a production mode: 
	```
	npm run start:prod
  ```
- in horizontal scaled mode: 
	```
	npm run start:multi
	```
- for running tests, please use this command:
  ```
  npm run test
  ```

4. By default app will be running on ``http://localhost:4000``, if you would like to change the running port, you can do it inside ``.env`` file:
    ```
    PORT=3000
    ```

5. Open required url in the browser or in Postman (check the list of available routes below)

## API Documentation

### GET: /api/users
Returns JSON with list of all existing users. By default list of users is empty.

Example:

#### Successful request

Request: **GET ``http://localhost:4000/api/users``**

Response:

- Status code: **200**
- Data:

```
[
	{
		"id": "1da9bee4-e4eb-425a-a3ca-16b7f8cafa85",
		"username": "blade",
		"age": 45,
		"hobbies": ["killing vampires"]
	},
	{
		"id": "be30e2c9-0604-487e-bdc0-999df977e7d5",
		"username": "nightwalker",
		"age": 21,
		"hobbies": ["walking"]
	},
]
```


### GET /api/users/{:id}
Returns a JSON with an object with user info. ``{:id}`` should be a valid UUID.

Examples:

#### Successful request

Request: **GET ``http://localhost:4000/api/users/1da9bee4-e4eb-425a-a3ca-16b7f8cafa85``**

Response:

- Status code: **200**
- Data:
```
{
	"id": "1da9bee4-e4eb-425a-a3ca-16b7f8cafa85",
	"username": "blade",
	"age": 45,
	"hobbies": ["killing vampires"]
}
```

#### Failed request: user id isn't valid

Request: **GET ``http://localhost:4000/api/users/test_id``**

Response:

- Status code: **400**
- Status Message: **User id test_id is invalid**

#### Failed request: user doesn't exist

Request: **GET ``http://localhost:4000/api/users/2050bcaf-ade2-4393-b8ca-d8061a20444c``**

Response:

- Status code: **404**
- Status Message: **User with id 2050bcaf-ade2-4393-b8ca-d8061a20444c doesn't exist**


### POST /api/users
Creates a new user record. Returns newly created record. Body should be a JSON with user data:

```
{
	username: "new_username",      // required, string
	age: 20,                       // required, number
	hobbies: ["hobby1", "hobby2"]  // required, array of strings
}
```

Examples:

#### Successful request

Request: **POST ``http://localhost:4000/api/users``**
 - Body: 
	```
	{
		"username": "nightcall",
		"age": 33,
		"hobbies": ["drive", "keep silence"]
	}
	```

Response: 
- Status code: **201**
- Data:
```
{
	"id": "2050bcaf-ade2-4393-b8ca-d8061a20444c",
	"username": "nightcall",
	"age": 33,
	"hobbies": ["drive", "keep silence"]
}
```

#### Failed request: user data isn't valid

Request: **POST ``http://localhost:4000/api/users``**

 - Body: 
	```
	{
		"user": "nightcall",
		"age": "average",
		"hobbies": ["drive", 35, null]
	}
	```
Response:
- Status code: **400**
- Message: **User data is invalid**


### PUT /api/users/{:id}
Update existing user with new data. Returns JSON with an updated object. ``{:id}`` should be a valid UUID. Body should be a JSON with user data:

```
{
	username: "new_username",      // required, string
	age: 20,                       // required, number
	hobbies: ["hobby1", "hobby2"]  // required, array of strings
}
```

Examples:

#### Successful request

Request: **PUT ``http://localhost:4000/api/users/2050bcaf-ade2-4393-b8ca-d8061a20444c``**
- Body: 
	```
	{
		"username": "ryan_gosling",
		"age": 33,
		"hobbies": ["drive", "keep silence", "dancing", "blade running"]
	}
	```
Response:
- Status code: **201**
- Response:
```
{
  "id": "2050bcaf-ade2-4393-b8ca-d8061a20444c",
  "username": "ryan_gosling",
  "age": 33,
  "hobbies": ["drive", "keep silence", "dancing", "blade running"]
}
```

#### Failed request: user data isn't valid

Request: **PUT ``http://localhost:4000/api/2050bcaf-ade2-4393-b8ca-d8061a20444c``**

 - Body: 
	```
	{
		"user": "ryan_gosling",
		"age": "average",
		"hobbies": ["drive", 35, null]
	}
	```
Response:
- Status code: **400**
- Status message: **User data is invalid**


#### Failed request: user id isn't valid

Request: **PUT ``http://localhost:4000/api/users/test_id``**

- Body: 
	```
	{
		"username": "ryan_gosling",
		"age": 33,
		"hobbies": ["drive", "keep silence", "dancing", "blade running"]
	}
	```
Response:
- Status code: **400**
- Status message: **User id test_id is invalid**

#### Failed request: user doesn't exist

Request: **GET ``http://localhost:4000/api/users/66d29d34-4d07-40d3-b248-45a8ffd6cb05``**

- Body: 
	```
	{
		"username": "ryan_gosling",
		"age": 33,
		"hobbies": ["drive", "keep silence", "dancing", "blade running"]
	}
	```
Response:
- Status code: **404**
- Status message: **User with id 66d29d34-4d07-40d3-b248-45a8ffd6cb05 doesn't exist**


### DELETE /api/users/{:id}
Deletes user record by id.
``{:id}`` should be a valid UUID.

Examples:

#### Successful request

Request: **DELETE ``http://localhost:4000/api/2050bcaf-ade2-4393-b8ca-d8061a20444c``**

Response:
- Status code: **204**

#### Failed request: user id isn't valid

Request: **DELETE ``http://localhost:4000/api/users/test_id``**

Response:
- Status code: **400**
- Status message: **User id test_id is invalid**

#### Failed request: user doesn't exist

Request: **DELETE ``http://localhost:4000/api/users/66d29d34-4d07-40d3-b248-45a8ffd6cb05``**

Response:
- Status code: **404**
- Status message: **User with id 66d29d34-4d07-40d3-b248-45a8ffd6cb05 doesn't exist**

### GENERAL STATUS CODES

#### Request to not existing route

Example:

Request: **GET ``http://localhost:4000/api/getallusers``**

Response:
- Status code: **404**
- Status message: **Route GET /api/getallusers doesn't exist**

#### Internal server error
Example:

Request: **POST ``http://localhost:4000/api/users``**
 - Body: 
	```
	{
		"username": "nightcall",
		"age": 33,
		"hobbies": ['signing']
	}
	```
Response:
- Status code: **500**
- Status message: **Internal server error: Unexpected token ''', ..."obbies": ['signing']"... is not valid JSON**