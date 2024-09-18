import { ModelType } from '@bk/categories';
import { BaseModel } from '../base/base.model';

export class PageModel extends BaseModel {
    // title = name
    public sections: string[] = [];

    constructor() {
        super();
        this.modelType = ModelType.Page;
    }
}
