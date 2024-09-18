import { CategoryType, ModelType } from '@bk/categories';
import { BaseModel } from '../base/base.model';

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
