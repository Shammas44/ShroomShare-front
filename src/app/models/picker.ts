import { ChoosenItem, CustomMap } from './standard';

export type PickerState = {
  /**
   * @description Items list selected by the user
   */
  items: ChoosenItem[];
  /**
   * @description Research keyword enter by the user
   */
  search: string;
  /**
   * @description List of chips containing items choosen by the user
   */
  chips: CustomMap<ChoosenItem>;
  /**
   * @description Currently favorite items list selected by the user
   */
  favorites: ChoosenItem[];
  /**
   * @description Current page fetched from the item provider api
   */
  currentPage: number;
  /**
   * @description Last available page from the item provider api
   */
  lastPage: number;
};

export type Coordinates = {
  lat: number;
  lon: number;
};

export type PickerCityState = {
  search: string;
  items: City[];
  coordinates?: Coordinates;
};

export type City = {
  lat: string;
  lon: string;
  display_name: string;
  icon: string;
};
