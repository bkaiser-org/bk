import { DeepPartial, DeepRequired } from 'ngx-vest-forms';

export type AddressFormModel = DeepPartial<{
  bkey: string,
  addressChannel: number,
  addressChannelLabel: string,
  addressUsage: number,
  addressUsageLabel: string,
  addressValue: string,
  addressValue2: string,
  phone: string,
  email: string,
  street: string,
  zipCode: string,
  city: string,
  countryCode: string,
  iban: string,
  isFavorite: boolean,
  isCc: boolean,
  isValidated: boolean,
  url: string,
  notes: string,
  tags: string,
  parentKey: string
}>;

export const addressFormModelShape: DeepRequired<AddressFormModel> = {
  bkey: '',
  addressChannel: -1,
  addressChannelLabel: '',
  addressUsage: -1,
  addressUsageLabel: '',
  addressValue: '',
  addressValue2: '',
  phone: '',
  email: '',
  street: '',
  zipCode: '',
  city: '',
  countryCode: '',
  iban: '',
  isFavorite: false,
  isCc: false,
  isValidated: false,
  url: '',
  notes: '',
  tags: '',
  parentKey: ''
};