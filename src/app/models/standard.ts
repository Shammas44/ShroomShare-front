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
  // filters-modal-mushrooms
  filterModalEnd = 'filters-modal-end',
  filterModalStart = 'filters-modal-start',
  filterModalRadius = 'filters-modal-radius',
  filterModalSpecies = 'filters-modal-species',
  filterModalUsages = 'filters-modal-usages',
  filterModalUsers = 'filters-modal-users',
  // filters-modal-my-mushrooms
  filterModalMyEnd = 'filters-modal-end',
  filterModalMyStart = 'filters-modal-start',
  filterModalMySpecies = 'filters-modal-species',
  filterModalMyUsages = 'filters-modal-usages',
  // others
  auth = 'auth',
  species = 'species',
  filterModalMyMushrooms = 'filters-modal-my-mushrooms',
  getMushroomsRequestParams = 'getMushrooms-request-params',
  getSpeciesRequestParams = 'getSpecies-request-params',
}

export class CustomMap<T> extends Map<string, T> {}
