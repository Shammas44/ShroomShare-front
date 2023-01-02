/* eslint camelcase: 0*/
import { Response, PaginatedResponse } from './response';
import { ChoosenItem } from './standard';

export type User = {
  id: string;
  username: string;
  admin: boolean;
};

export type UserFilter = {
  currentPage?: number;
  pageSize?: number;
  search?: string;
};

export type UsersResponse = Response & {
  users: User[];
};

export type UserResponse = Response & {
  user: User;
};

export type AddUserRequest = {
  username: string;
  password: string;
  email: string;
  admin?: boolean;
};

export type AddUserResponse = {
  message: string;
  token: string;
  user: User;
}

export type ModifyUserRequest = {
  username?: string;
  password?: string;
  email?: string;
  admin?: boolean;
};

export type ChoosenUser = User & ChoosenItem;

export class UsersMap extends Map<string, ChoosenUser> {}
