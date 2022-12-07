import {Usage} from './usage';
import {Picture} from './picture';

export type Specy = {
  name: String;
  description: String;
  usage: Usage,
  picture_id: String;
  id: String;
  picture: Picture;
};
