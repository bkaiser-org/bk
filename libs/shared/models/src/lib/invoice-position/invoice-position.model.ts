import { ModelType } from '@bk/categories';
import { BASE_FIELDS, BaseModel, FieldDescription } from '../base/base.model';

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

export const INVOICE_POSITION_FIELDS: FieldDescription[] = [
  { name: 'personKey',     label: 'personKey',   value: true },
  { name: 'firstName',   label: 'firstName',   value: true },
  { name: 'year',         label: 'year',   value: true },
  { name: 'amount',           label: 'amount',     value: true },
  { name: 'currency',   label: 'currency',   value: true },
  { name: 'isBillable',   label: 'isBillable',   value: true }
];
export const ALL_INVOICE_POSITION_FIELDS = BASE_FIELDS.concat(INVOICE_POSITION_FIELDS);
