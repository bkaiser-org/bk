import { ModelType } from '@bk/categories';
import { BASE_FIELDS, BaseModel, FieldDescription } from '../base/base.model';

export class PageModel extends BaseModel {
    // title = name
    public sections: string[] = [];

    constructor() {
        super();
        this.modelType = ModelType.Page;
    }
}

export const PAGE_FIELDS: FieldDescription[] = [
  { name: 'sections',     label: 'sections',   value: true },
];
export const ALL_PAGE_FIELDS = BASE_FIELDS.concat(PAGE_FIELDS);
