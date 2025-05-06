import { UserData } from '../storage/users';

type ValidateUserDataProps = Omit<UserData, 'id'>

export const validateUserData = ({
  username,
  age,
  hobbies
}: ValidateUserDataProps): boolean => {
  if (!username || !age || !hobbies) return false;

  if (typeof username !== 'string') return false;

  if (isNaN(age)) return false;

  if (!Array.isArray(hobbies)) return false;
  if (hobbies.length && hobbies.some(hobby => typeof hobby !== 'string')) return false;

  return true;
};