import { ServerResponse } from 'http';

type HandleResponseProps = {
  res: ServerResponse
  statusCode: number
  statusMessage?: string
  data?: string
}

export const handleResponse = ({ 
  res,
  statusCode,
  statusMessage,
  data
}: HandleResponseProps) => {
  res.statusCode = statusCode;

  if (statusMessage) {
    res.statusMessage = statusMessage;
  }
  
  if (data) {
    res.setHeader('Content-Type', 'application/json');
    res.end(data);
  }
  if (!data) res.end();
};