import { ChoosenItem, CustomMap } from './standard';

export type PickerState = {
  items: ChoosenItem[];
  search: string;
  chips: CustomMap<ChoosenItem>;
  favorites: ChoosenItem[];
  currentPage: number;
  lastPage: number;
};
