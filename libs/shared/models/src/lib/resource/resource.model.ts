import { CategoryType, ModelType } from '@bk/categories';
import { BASE_FIELDS, BaseModel, FieldDescription } from '../base/base.model';

export class ResourceModel extends BaseModel {
  // name = id, e.g. Kasten-Nr., Key Nr
  // category = ResourceType
  // url = avatar (e.g. boats)
  public currentValue = 0;  // e.g. depotfee, boat valuation
  public subType = CategoryType.Undefined as number;
  public load = '';
  public weight = 0;
  public usage = CategoryType.Undefined as number;
  public color = ''; // hexcolor

  constructor() {
    super();
    this.modelType = ModelType.Resource;    // 3: Boat, 4: Resource
  }
}

export const RESOURCE_FIELDS: FieldDescription[] = [
  { name: 'currentValue', label: 'currentValue', value: true },
  { name: 'subType', label: 'subType', value: true },
  { name: 'load', label: 'load', value: true },
  { name: 'weight', label: 'weight', value: true },
  { name: 'usage', label: 'usage', value: true },
  { name: 'color', label: 'color', value: true },
];
export const ALL_RESOURCE_FIELDS = BASE_FIELDS.concat(RESOURCE_FIELDS);
