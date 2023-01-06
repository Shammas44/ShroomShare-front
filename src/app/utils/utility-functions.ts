import { ToastController } from '@ionic/angular';
import { KeyString, Primitive } from '../models/standard';
import { CustomMap } from '../models/standard';

/**
 * @description Return the first item in an array sharing a same property value as
 * the provided object for a specific property name
 * @param {T[]} array An array containing data
 * @param {string} propertyName An array containing data
 * @param {T} obj The object to compare with
 */
export function findByProperty<T extends KeyString>(
  array: T[],
  propertyName: string,
  obj: T
): T | undefined {
  return array.find((item) => item[propertyName] === obj[propertyName]);
}

/**
 * @description Return the index of the first item in provided array
 * containing the same property value for a specific property name or primitive value
 * @param {T[]} array An array containing data
 * @param {string} property The property name
 * @param {Primitive} search The value to compare with
 * @return {number} an array index
 */
export function findIndexByProperty<T extends KeyString>(
  array: T[],
  property: string,
  search: Primitive
): number;

/**
 * @description Return the index of the first item in provided array
 * containing the same property value for a specific property name or primitive value
 * @param {T[]} array An array containing data
 * @param {string} property The property name
 * @param {T} search The object to compare with
 * @return {number} an array index
 */
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

/**
 * @description Return a string composed of a specific object property
 * from a Map, each value is separated by the specified value separator
 * @param {T[]} array An array containing data
 * @param {string} key Desired key of the Map object
 * @param {string} separator the separator
 * @return {string} string containing concatanated values
 */
export function concatSinglePropertyOfMap<
  U extends { [index: string]: any },
  T extends CustomMap<U>
>(data: T | undefined | null, key: string, separator: string = ',') {
  let result = '';
  if (data) {
    const iterator = data.values();
    for (const value of iterator) {
      if (key) result += `${value[key]}${separator}`;
    }
  }
  return result.slice(0, -1) || undefined;
}

enum ToastPositions {
  top = 'top',
  middle = 'middle',
  bottom = 'bottom',
}

export type ToastOptions = {
  message: string;
  position?: ToastPositions;
  duration?: number;
  icon?: ToastTypes;
  cssClass?: string | string[];
};

export enum ToastTypes {
  info,
  warning,
  error,
  success,
}

const toastTheming = [
  { icon: 'information-circle-outline', color: '' },
  { icon: 'alert-circle-outline', color: 'warning' },
  { icon: 'bug-outline', color: 'danger' },
  { icon: 'checkmark-circle-outline', color: 'success' },
];

/**
 * @description Return a toast Handler function
 * @param {ToastController} controller The toast controller
 * @return {Function} Function to handle toast
 */
export function getPresentToastFunc(controller: ToastController) {
  return async function (options: ToastOptions | string) {
    let message = '',
      duration: number = 4000,
      position: ToastPositions = ToastPositions.top,
      icon: string = toastTheming[ToastTypes.info].icon,
      cssClass: string | string[] = 'toast-wrapper',
      color: string = toastTheming[ToastTypes.info].color,
      toast;
    if (typeof options === 'string') {
      message = options;
      duration = duration;
      position = position;
      color = color;
      icon = icon;
    } else {
      message = options.message;
      duration = options.duration || duration;
      position = options.position || position;
      icon = toastTheming[options.icon || 0].icon;
      cssClass = options.cssClass || cssClass;
      color = toastTheming[options.icon || 0].color;
    }
    toast = await controller.create({ message, duration, position, icon, cssClass, color });
    await toast.present();
  };
}
