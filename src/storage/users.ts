import { v4 as uuidv4 } from 'uuid';

export const users = [
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
  }
];