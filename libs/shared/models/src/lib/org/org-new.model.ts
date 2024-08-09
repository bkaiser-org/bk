import { ModelType } from '@bk/categories';
import { DeepPartial, DeepRequired } from 'ngx-vest-forms';

export type OrgNewFormModel = DeepPartial<{
  orgName: string,
  orgType: number,
  dateOfFoundation: string,
  dateOfLiquidation: string,
  street: string,
  countryCode: string,
  zipCode: string,
  city: string,
  phone: string,
  email: string,
  taxId: string,
  iban: string,
  notes: string,
  tags: string,
  modelType: number
}>;

export const orgNewFormModelShape: DeepRequired<OrgNewFormModel> = {
  orgName: '',
  orgType: -1,
  dateOfFoundation: '',
  dateOfLiquidation: '',
  street: '',
  countryCode: '',
  zipCode: '',
  city: '',
  phone: '',
  email: '',
  taxId: '',
  iban: '',
  notes: '',
  tags: '',
  modelType: ModelType.Org
}