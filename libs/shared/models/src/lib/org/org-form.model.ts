import { DeepPartial, DeepRequired } from 'ngx-vest-forms';

export type OrgFormModel = DeepPartial<{
  bkey: string,
  orgName: string,
  orgType: number,
  dateOfFoundation: string,
  dateOfLiquidation: string,
  taxId: string,
  iban: string,
  notes: string,
  url: string,
  tags: string,
  modelType: number,
  bexioId: string
}>;

export const orgFormModelShape: DeepRequired<OrgFormModel> = {
  bkey: '',
  orgName: '',
  orgType: -1,
  dateOfFoundation: '',
  dateOfLiquidation: '',
  taxId: '',
  iban: '',
  notes: '',
  url: '',
  tags: '',
  modelType: -1,
  bexioId: ''
};