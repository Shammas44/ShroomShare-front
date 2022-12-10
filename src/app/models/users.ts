import {Response, PaginatedResponse} from './response';
export type User = {
  id: string;
  username: string;
  admin: boolean;
};

export type UserFilter = {
  currentPage?: number;
  pageSize?: number;
  search?: string;
}

export type UsersResponse = Response & {
  users: User[];
};

export type PaginatedUsersResponse = PaginatedResponse & {
  users: User[];
};

export type UserResponse = Response & {
  user: User;
};

export type AddUserRequest = {
  username: string;
  password: string;
  email: string;
  admin: string;
}

export type ModifyUserRequest = {
  username?: string;
  password?: string;
  email?: string;
  admin?: boolean;
}
