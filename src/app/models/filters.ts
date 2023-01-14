import { PickerCityState, PickerState } from './picker';
import { Usage } from './usages';

export type UsageState = {
  name: Usage;
  checked: boolean;
  value: keyof Usage;
};

export class UsageMap extends Map<Usage, UsageState> {}

export type TmpState = {
  [index: string]: any;
  users?: PickerState | null;
  species?: PickerState | null;
  usages?: UsageMap | null;
  radius?: number;
  start?: string;
  end?: string;
  city?: PickerCityState;
};

export type PaginatedFilters = {
  showPictures?: boolean;
  currentPage?: number;
  pageSize?: number;
  search?: string;
};
