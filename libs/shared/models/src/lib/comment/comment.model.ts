import { ModelType } from '@bk/categories';
import { BaseModel, BASE_FIELDS, FieldDescription } from '../base/base.model';

export class CommentModel extends BaseModel {
    // name = authorName
    // category = Category.Undefined = -1
    // url = empty
    // index = empty
    // description = comment text
    public authorKey = ''; // bkey of a person
    public creationDate = '';   // StoreDate format
    public parentKey = ''; // the key of the parent subject
    public parentCollection = ''; // the collection of the parent

    constructor() {
        super();
        this.modelType = ModelType.Comment;
    }
}

export const COMMENT_FIELDS: FieldDescription[] = [
    { name: 'authorKey', label: 'authorKey', value: true },
    { name: 'creationDate', label: 'creationDate', value: true },
    { name: 'parentKey', label: 'parentKey', value: true },
    { name: 'parentCollection', label: 'parentCollection', value: true }
];
export const ALL_COMMENT_FIELDS = BASE_FIELDS.concat(COMMENT_FIELDS);
