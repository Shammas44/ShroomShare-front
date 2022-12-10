import {Usage} from './usages';
import {Picture} from './pictures';
import {Response} from './response'

export type SpeciesResponse = {
  message: string;
  species: Specy[];
};

export type SpecyResponse = Response & {
  specy: Specy;
}

export type Specy = {
  name: string;
  description: string;
  usage: Usage,
  picture_id: string;
  id: string;
  picture: Picture;
};

export type SpeciesFilter = {
  currentPage?: number;
  pageSize?: number;
  showPictures?: boolean;
};
