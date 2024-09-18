import { AddressChannel, AddressUsage, ModelType } from '@bk/categories';
import { BaseModel } from '../base/base.model';
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
    this.tenant = [getValue(_remoteConfig, 'tenant_id').asString()];
  }
}
