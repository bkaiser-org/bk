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
    this.tenant = getValue(_remoteConfig, 'tenant_id').asString();
  }
}

export const USER_FIELDS = [
  { name: 'bkey', label: 'bkey', value: true },
  { name: 'loginEmail', label: 'loginEmail', value: true },
  { name: 'personKey', label: 'personKey', value: true },
  { name: 'personName', label: 'personName', value: true },
  { name: 'index', label: 'index', value: false },
  { name: 'useFaceId', label: 'useFaceId', value: true },
  { name: 'userLanguage', label: 'userLanguage', value: true },
  { name: 'useTouchId', label: 'useTouchId', value: true },
  { name: 'toastLength', label: 'toastLength', value: true },
  { name: 'avatarUsage', label: 'avatarUsage', value: true },
  { name: 'gravatarEmail', label: 'gravatarEmail', value: true },
  { name: 'nameDisplay', label: 'nameDisplay', value: true },
  { name: 'personSortCriteria', label: 'personSortCriteria', value: true },
  { name: 'newsDelivery', label: 'newsDelivery', value: true },
  { name: 'invoiceDelivery', label: 'invoiceDelivery', value: true },
  { name: 'isArchived', label: 'isArchived', value: true },
  { name: 'showArchivedData', label: 'showArchivedData', value: true },
  { name: 'showTestData', label: 'showTestData', value: true },
  { name: 'showDebugInfo', label: 'showDebugInfo', value: true }
];
export const ALL_USER_FIELDS = USER_FIELDS;

