/* eslint camelcase: 0*/
import { Usage } from './usages';
import { Picture } from './pictures';
import { Response } from './response';
import { ChoosenItem } from './standard';

export type SpeciesResponse = {
  message: string;
  species: Specy[];
};

export type SpecyResponse = Response & {
  specy: Specy;
};

export type Specy = {
  name: string;
  description: string;
  usage: Usage;
  picture_id: string;
  id: string;
  picture: Picture;
};

export type SpeciesFilter = {
  currentPage?: number;
  pageSize?: number;
  showPictures?: boolean;
  count?: boolean;
  search?: string;
};

export type ChoosenSpecy = Specy & ChoosenItem;
