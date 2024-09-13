import { CategoryType } from '@bk/categories';

export interface FieldDescription {
  name: string;
  label: string;
  value: boolean;
}

// ConfigService can not be injected in the BaseModel constructor
// because Angular instantiates a child class, which effectively initialises the parent class.
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

export const BASE_FIELDS: FieldDescription[] = [
    { name: 'bkey',             label: 'bkey',          value: false },
    { name: 'name',             label: 'name',          value: true },
    { name: 'tenant',           label: 'tenant',        value: false },
    { name: 'category',         label: 'category',      value: false },
    { name: 'url',              label: 'url',           value: false },
    { name: 'index',            label: 'index',         value: false },
    { name: 'isArchived',       label: 'isArchived',    value: false },
    { name: 'isTest',           label: 'isTest',        value: false },
    { name: 'tags',             label: 'tags',          value: false },
    { name: 'modelType',        label: 'modelType',     value: false },        
    { name: 'description',      label: 'description',   value: false }
];
