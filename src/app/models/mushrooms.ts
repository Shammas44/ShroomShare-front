import { Picture } from './pictures';
import {Response} from './response';

export enum Point {
  point = 'Point',
}

export type Location = {
  type: Point;
  coordinates: Number[];
};

export type Mushroom = {
  specy_id: String;
  user_id: String;
  picture_id: String;
  description: String;
  date: String;
  id: String;
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
  latitude?: Number;
  longitude?: Number;
  specyId?: String;
  userId?: String;
  showPictures?: Boolean;
  from?: String;
  to?: String;
  currentPage?: Number;
  pageSize?: Number;
};

export type AddMushroomRequest = {
  specy_id: String;
  picture: String;
  description?: String;
  date: String;
  location: Location;
};

export type ModifyMushroomRequest = {
  specy_id?: String;
  picture?: String;
  description?: String;
  date?: String;
  location?: Location;
};
