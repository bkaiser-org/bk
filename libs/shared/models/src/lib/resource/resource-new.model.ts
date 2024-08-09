import { ModelType } from '@bk/categories';
import { DeepPartial, DeepRequired } from 'ngx-vest-forms';

export type ResourceNewFormModel = DeepPartial<{
  name: string,
  lockerNr: number,
  keyNr: number,
  keyName: string,
  category: number,
  boatType: number,
  boatUsage: number,
  currentValue: number,
  weight: number,
  load: string,
  hexColor: string,
  notes: string,
  tags: string,
  modelType: ModelType
}>;

export const resourceNewFormModelShape: DeepRequired<ResourceNewFormModel> = {
  name: '',
  lockerNr: -1,
  keyNr: -1,
  keyName: '',
  category: -1,
  boatType: -1,
  boatUsage: -1,
  currentValue: -1,
  weight: -1,
  load: '',
  hexColor: '',
  notes: '',
  tags: '',
  modelType: ModelType.Resource
};