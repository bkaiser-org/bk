import { ModelType } from '@bk/categories';
import { DeepPartial, DeepRequired } from 'ngx-vest-forms';

export type ResourceFormModel = DeepPartial<{
  bkey: string,
  name: string,
  boatName: string,
  keyName: string,
  lockerNr: number,
  keyNr: number,
  resourceType: number,       // category
  boatType: number,       // subType
  boatUsage: number,
  currentValue: number,
  weight: number,
  load: string,
  hexColor: string,
  url: string,
  notes: string,
  tags: string,
  modelType: ModelType
}>;

export const resourceFormShape: DeepRequired<ResourceFormModel> = {
  bkey: '',
  name: '',
  boatName: '',
  keyName: '',
  lockerNr: 0,
  keyNr: 0,
  resourceType: -1,
  boatType: -1,
  boatUsage: -1,
  currentValue: 0,
  weight: 0,
  load: '',
  hexColor: '',
  url: '',
  notes: '',
  tags: '',
  modelType: ModelType.Resource
};