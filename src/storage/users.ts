import { readFile, writeFile } from 'fs/promises';
import { UUIDTypes, v4 as uuidv4 } from 'uuid';
import { DB_FILE_PATH } from '../constants';

export type UserData = {
  id: UUIDTypes
  username: string
  age: number
  hobbies: string[] | []
}

export class Users {
  static readonly pathToDB: string = DB_FILE_PATH;

  static async getAll(): Promise<UserData[]> {
    const data = await readFile(Users.pathToDB, { encoding: 'utf-8' });
    return JSON.parse(data);
  }

  static async get(id: UUIDTypes): Promise<UserData | undefined> {
    try {
      const usersData: UserData[] = await Users.getAll();
      const user: UserData | undefined = usersData.find(user => user.id === id);
      return user;
    } catch {
      return;
    }
  }

  static async add({ username, age, hobbies }: Omit<UserData, 'id'>): Promise<UserData | undefined> {
    const id = uuidv4();
    const newUser: UserData = { id, username, age, hobbies };
    const usersData = await Users.getAll();
    if (usersData) {
      usersData.push(newUser);
      await writeFile(Users.pathToDB, JSON.stringify(usersData), { encoding: 'utf-8'} );
      return newUser;
    }
    return;
  }

  static async update(id: UUIDTypes, updatedData:  Omit<UserData, 'id'>): Promise<UserData | undefined> {
    const usersData = await Users.getAll();
    const userIndex = usersData.findIndex(user => user.id === id);
    if (userIndex >= 0) {
      const updatedUser: UserData = { id, ...updatedData};
      usersData[userIndex] = updatedUser;
      await writeFile(Users.pathToDB, JSON.stringify(usersData), { encoding: 'utf-8'} );
      return updatedUser;
    }
    return;
  }

  static async delete(id: UUIDTypes): Promise<boolean> {
    const usersData = await Users.getAll();
    const user = usersData.find(user => user.id === id);
    if (user) {
      const updatedUsersData = usersData.filter(user => user.id !== id);
      await writeFile(Users.pathToDB, JSON.stringify(updatedUsersData), { encoding: 'utf-8'} );
      return true;
    }
    return false;
  }

  static async clear(): Promise<void> {
    await writeFile(Users.pathToDB, JSON.stringify([]), { encoding: 'utf-8' });
  }
};
