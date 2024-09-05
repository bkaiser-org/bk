import { BaseModel } from '../base/base.model';
import { Roles } from '../role/roles';
import { CategoryType, ModelType } from '@bk/categories';
import { getRemoteConfig, getValue } from 'firebase/remote-config';

export class UserModel extends BaseModel {
  public loginEmail = '';           // Firebase Auth Login Email
  public personKey = '';            // PersonModel.bkey
  public personName = '';           // PersonModel.firstName + ' ' + PersonModel.lastName

  // authorization
  public roles: Roles = {};

  // settings
  public useTouchId = false;
  public useFaceId = false;
  public userLanguage = '';
  public toastLength = 0;
  public avatarUsage = 0;
  public gravatarEmail = '';
  public nameDisplay = 0;
  public personSortCriteria = 0;
  public newsDelivery = 0;
  public invoiceDelivery = 0;
  public showArchivedData = false;
  public showTestData = false;
  public showDebugInfo = false;

  constructor() {
    super();
    this.modelType = ModelType.User;
    this.category = CategoryType.Undefined as number;
    const _remoteConfig = getRemoteConfig();
    this.tenant = [getValue(_remoteConfig, 'tenant_id').asString()];
  }
}
