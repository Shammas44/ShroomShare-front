import { User } from "./users";

export type AuthRequest = {
  username: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};
