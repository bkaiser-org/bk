import { CategoryType } from '@bk/categories';

export interface FieldDescription {
  name: string;
  label: string;
  value: boolean;
}

export class BaseModel {
  public bkey? = '';
  public name= '';
  public tenant: string[] = [];
  public category = CategoryType.Undefined as number;
  public url = '';
  public index = '';
  public isArchived = false;
  public isTest = false;
  public tags = '';        // a list of numbers, e.g. 1,2,3 = indexes in tagTemplate
  public modelType = CategoryType.Undefined as number;
  public description = '';
}
