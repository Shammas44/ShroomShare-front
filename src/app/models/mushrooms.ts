import { Picture } from './pictures';
import {Response} from './response';

export type Location = {
  type: 'Point';
  coordinates: [Number,Number];
};

export type Mushroom = {
  specy_id: string;
  user_id: string;
  picture_id: string;
  description: string;
  date: string;
  id: string;
  picture: Picture;
  location: Location;
};

export type MushroomsResponse = Response & {
  mushrooms: Mushroom[];
};

export type MushroomResponse = Response & {
  mushroom: Mushroom;
};

export type MushroomsFilter = {
  latitude?: number;
  longitude?: number;
  specyId?: string;
  userId?: string;
  showPictures?: boolean;
  from?: string;
  to?: string;
  currentPage?: number;
  pageSize?: number;
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
