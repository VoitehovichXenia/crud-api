import { ServerResponse } from 'http';
import { handleResponse } from './handleResponse';

export const handleErrors = (status: number, errMessage: string, res: ServerResponse): void => {
  if (status !== 500) {
    handleResponse({ res, statusCode: status, statusMessage: errMessage });
  } else {
    handleResponse({ res, statusCode: status, statusMessage: `Internal server error: ${errMessage}` });
  }
};
