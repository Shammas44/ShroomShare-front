import {Usage} from './usages';
import {Picture} from './pictures';
import {Response} from './response'

export type SpeciesResponse = {
  message: String;
  species: Specy[];
};

export type SpecyResponse = Response & {
  specy: Specy;
}

export type Specy = {
  name: String;
  description: String;
  usage: Usage,
  picture_id: String;
  id: String;
  picture: Picture;
};

export type SpeciesFilter = {
  currentPage?: Number;
  pageSize?: Number;
  showPictures?: Boolean;
};
