import { AddressChannel, AddressUsage, ModelType } from '@bk/categories';
import { BASE_FIELDS, BaseModel, FieldDescription } from '../base/base.model';
import { getRemoteConfig, getValue } from 'firebase/remote-config';

export class AddressModel extends BaseModel {
  public addressUsage = AddressUsage.Home; 
  public addressUsageLabel = '';  // optional label for custom address types
  // addressChannel -> category
  public addressChannelLabel = ''; // optional label for custom channel types
  // addressChannelIcon -> url
  // addressValue -> name  (e.g. phone number, email address, street)
  public addressValue2 = ''; // optional if postal address
  public zipCode = '';
  public city = '';
  public countryCode = '';
  public isFavorite = false;
  public isValidated = false;
  public isCc = false;
  public parentKey = ''; // the key of the parent subject

  constructor() {
    super();
    this.modelType = ModelType.Address;
    this.category = AddressChannel.Phone as number;
    const _remoteConfig = getRemoteConfig();
    this.tenant = getValue(_remoteConfig, 'tenant_id').asString();
  }
}

export const ADDRESS_FIELDS: FieldDescription[] = [
  { name: 'addressUsage', label: '@input.addressUsage.label', value: true },
  { name: 'addressUsageLabel', label: '@input.addressUsageLabel.label', value: true },
  { name: 'addressChannelLabel', label: '@input.addressChannelLabel.label', value: true },
  { name: 'addressValue2', label: '@input.addressValue2.label', value: true },
  { name: 'zipCode', label: '@input.zipCode.label', value: true },
  { name: 'city', label: '@input.city.lable', value: true },
  { name: 'countryCode', label: '@input.countryCode.label', value: true },
  { name: 'isFavorite', label: '@input.isFavorite.label', value: false },
  { name: 'isValidated', label: '@input.isValidated.label', value: false },
  { name: 'isCc', label: '@input.isCc.label', value: false }
];
export const ALL_ADDRESS_FIELDS = BASE_FIELDS.concat(ADDRESS_FIELDS);
