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

export type BaseFilter = {
  currentPage?: number;
  pageSize?: number;
  search?: string;
};

export enum storageKeys {
  auth = 'auth',
  species = 'species',
  filterModalEnd = 'filters-modal-end',
  filterModalStart = 'filters-modal-start',
  filterModalRadius = 'filters-modal-radius',
  filterModalSpecies = 'filters-modal-species',
  filterModalUsages = 'filters-modal-usages',
  filterModalUsers = 'filters-modal-users',
  getMushroomsRequestParams = 'getMushrooms-request-params',
}

export class CustomMap<T> extends Map<string, T> {}
