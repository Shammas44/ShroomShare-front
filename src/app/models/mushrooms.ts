import { Response } from './response';
import { User } from './users';
import { Specy } from './species';
import { CollectionName } from './collection-names';
import { PaginatedFilters } from './filters';

export type Location = {
  type: 'Point';
  coordinates: [Number, Number];
};

export type Mushroom = {
  name: string;
  author: string;
  specy: Specy;
  user: User;
  picture: string;
  description: string;
  date: string;
  id: string;
  location: Location;
};

export type MushroomWithPic = Mushroom & {
  picture: MushroomPicture;
};

export type MushroomPicture = {
  value: string;
  specy: string;
  mushroom: string;
  collectionName: CollectionName.mushrooms;
  date: string;
  user: string;
  id: string;
};

export type MushroomsResponse = Response & {
  mushrooms: Mushroom[];
};

export type MushroomResponse = Response & {
  mushroom: Mushroom;
};

export type MushroomsFilter = PaginatedFilters & {
  latitude?: number;
  longitude?: number;
  specyIds?: string;
  userIds?: string;
  usages?: string;
  from?: string;
  to?: string;
  radius?: number;
};

export type AddMushroomRequest = {
  specy_id: string;
  picture: string;
  description?: string;
  date: string;
  location: Location;
};

export type ModifyMushroomRequest = {
  specy_id?: string;
  picture?: string;
  description?: string;
  date?: string;
  location?: Location;
};
