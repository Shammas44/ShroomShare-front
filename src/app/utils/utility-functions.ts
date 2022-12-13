import { KeyString, Primitive } from '../models/standard';

export function findByProperty<T extends KeyString>(
  array: T[],
  propertyName: string,
  obj: T
): T | undefined {
  return array.find((item) => item[propertyName] === obj[propertyName]);
}

export function findIndexByProperty<T extends KeyString>(
  array: T[],
  property: string,
  search: Primitive
): number;

export function findIndexByProperty<T extends KeyString>(
  array: T[],
  property: string,
  search: T
): number;

export function findIndexByProperty<T extends KeyString>(
  array: T[],
  property: string,
  search: Primitive | T
): number {
  if (search instanceof Object) {
    return array.findIndex((item) => item[property] === search[property]);
  } else {
    return array.findIndex((item) => item[property] === search);
  }
}
