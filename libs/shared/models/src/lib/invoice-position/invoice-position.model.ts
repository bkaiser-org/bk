import { ModelType } from '@bk/categories';
import { BaseModel } from '../base/base.model';

export class InvoicePositionModel extends BaseModel {
    public personKey = '';
    public firstName = '';
    // lastName = name
    // category : InvoicePositionType
    // url: avatarUrl from Person
    public year = 0;
    public amount = 0;
    public currency = 'CHF';
    public isBillable = true;
    // notes
    // tags

    constructor() {
        super();
        this.modelType = ModelType.InvoicePosition;
    }
}
