import { TmpState, UsageMap } from '../models/filters';
import { MushroomsFilter } from '../models/mushrooms';
import { PickerState } from '../models/picker';
import { ChoosenItem, CustomMap } from '../models/standard';
import { Usage } from '../models/usages';
import { concatSinglePropertyOfMap as concat } from './utility-functions';

export function getDefaultState(favorites?: ChoosenItem[]): PickerState {
  return {
    items: [],
    search: '',
    chips: new CustomMap(),
    favorites: favorites || [],
    currentPage: 1,
    lastPage: 2,
  };
}

export function getDefaultUsageState(): UsageMap {
  const map = new Map();
  Object.entries(Usage).forEach((values) => {
    const [key, value] = [values[0], values[1]];
    map.set(value, { name: value, checked: false, value: key });
  });
  return map;
}

export function getDate() {
  const currentDateIso = new Date().toISOString();
  const currentDate = new Date();
  const prevYearDate = new Date();
  prevYearDate.setFullYear(currentDate.getFullYear() - 1);
  const prevYearDateIso = prevYearDate.toISOString();
  return {
    currentDate,
    currentDateIso,
    prevYearDate,
    prevYearDateIso,
  };
}

export function setApiParams(data: TmpState): MushroomsFilter {
  const params = {} as MushroomsFilter;
  const userIds = concat(data.users?.chips, 'id');
  if (userIds) params.userIds = userIds;
  const speciesIds = concat(data.species?.chips, 'id');
  if (speciesIds) params.specyIds = speciesIds;
  const usages = Array.from(data.usages?.values() || []).filter((value) => {
    if (value.checked === true) return value;
    return;
  });
  if (usages.length === 1) params.usage = usages[0].value as Usage;
  if (data.radius) params.radius = data.radius * 1000;
  if (data.start) params.from = new Date(data.start).toISOString();
  if (data.end) params.to = new Date(data.end).toISOString();
  if (data.city?.coordinates) {
    params.latitude = data.city.coordinates.lat;
    params.longitude = data.city.coordinates.lon;
  }
  console.log({ params });
  return params;
}
