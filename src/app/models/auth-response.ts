import { User } from "./user";

export type AuthResponse = {
  token: string;
  user: User;
};
