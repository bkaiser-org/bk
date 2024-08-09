import { DeepPartial, DeepRequired } from 'ngx-vest-forms';

export type TripFormModel = DeepPartial<{
  bkey: string,
  name: string,
  startDateTime: string,
  endDateTime: string,
  resourceKey: string,
  locations: string[],
  persons: string[],
  url: string,
  notes: string,
  tags: string,
  modelType: number
}>;

export const tripFormModelShape: DeepRequired<TripFormModel> = {
  bkey: '',
  name: '',
  startDateTime: '',
  endDateTime: '',
  resourceKey: '',
  locations: [],
  persons: [],
  url: '',
  notes: '',
  tags: '',
  modelType: -1
};