
import { DeepPartial, DeepRequired } from 'ngx-vest-forms';

export type LocationFormModel = DeepPartial<{
  bkey: string,
  name: string,
  locationType: number,
  latitude: number,
  longitude: number,
  placeId: string,
  what3words: string,
  height: number,
  speed: number,
  direction: number,
  url: string,
  notes: string,
  tags: string,
  modelType: number
}>;

export const locationFormModelShape: DeepRequired<LocationFormModel> = {
  bkey: '',
  name: '',
  locationType: -1,
  latitude: 0,
  longitude: 0,
  placeId: '',
  what3words: '',
  height: 0,
  speed: 0,
  direction: 0,
  url: '',
  notes: '',
  tags: '',
  modelType: -1
};