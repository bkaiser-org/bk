import { ModelType } from '@bk/categories';
import { BaseModel } from '../base/base.model';

export class PageModel extends BaseModel {
    public sections: string[] = [];

    constructor() {
        super();
        this.modelType = ModelType.Page;
    }
}
