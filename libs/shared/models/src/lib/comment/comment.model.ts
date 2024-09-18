import { ModelType } from '@bk/categories';
import { BaseModel } from '../base/base.model';

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
