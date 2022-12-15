/* eslint camelcase: 0*/
import { ChoosenUser } from './users';
import { Usage } from './usages';

export type KeyString = {
  [key: string]: any;
};

export type Primitive = string | number | boolean;

export type FilterForm = {
  favoriteUsers: ChoosenUser[];
  usage: Usage[];
  radius: number;
};

export type ChoosenItem = KeyString & {
  checked?: boolean;
};
