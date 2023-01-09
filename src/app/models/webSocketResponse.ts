/* eslint-disable */
import { webSocketResponseUser } from './webSocketResponseUser';

export type webSocketResponse = {
  status: string;
  message: string;
  timestamp: number;
  user: webSocketResponseUser;
};
