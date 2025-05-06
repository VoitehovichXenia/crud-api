import { v4 as uuidv4, UUIDTypes } from 'uuid';

export type UserData = {
  id: UUIDTypes
  username: string
  age: number
  hobbies: string[] | []
}

export const users: UserData[] = [
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