import { PickerState } from './picker';

export type UsageState = {
  name: string;
  checked: boolean;
};

export class UsageMap extends Map<string, UsageState> {}

export type TmpState = {
  [index: string]: any;
  users: PickerState | null;
  species: PickerState | null;
  usages: UsageMap | null;
  radius: number;
  start: string;
  end: string;
};

export type PaginatedFilters = {
  showPictures?: boolean;
  currentPage?: number;
  pageSize?: number;
}
