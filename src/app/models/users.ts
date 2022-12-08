import {Response} from './response';
export type User = {
  id: string;
  username: string;
  admin: boolean;
};

export type UserFilter = {
  currentPage?: Number;
  pageSize?: Number;
}

export type UsersResponse = Response & {
  users: User[];
};

export type UserResponse = Response & {
  user: User;
};

export type AddUserRequest = {
  username: String;
  password: String;
  email: String;
  admin: String;
}

export type ModifyUserRequest = {
  username?: String;
  password?: String;
  email?: String;
  admin?: Boolean;
}
