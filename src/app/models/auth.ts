/* eslint camelcase: 0*/
import { User } from './users';

export type AuthRequest = {
  username: string;
  password: string;
};

export type AuthResponse = {
  message: string;
  token: string;
  user: User;
};

