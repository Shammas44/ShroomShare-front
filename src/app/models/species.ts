import { Usage } from './usages';
import { Response } from './response';
import { ChoosenItem } from './standard';
import { CollectionName } from './collection-names';

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
  picture: string;
  id: string;
};

export type SpecyWithPic = Specy & {
  picture: SpecyPicture;
};

export type SpecyPicture = {
  value: string;
  specy: string;
  collectionName: CollectionName.species;
  id: string;
  date: string;
};

export type SpeciesFilter = {
  currentPage?: number;
  pageSize?: number;
  showPictures?: boolean;
  count?: boolean;
  search?: string;
};

export type ChoosenSpecy = Specy & ChoosenItem;
