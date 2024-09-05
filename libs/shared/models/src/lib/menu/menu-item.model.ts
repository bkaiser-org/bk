import { ModelType } from '@bk/categories';
import { BaseModel } from '../base/base.model';
import { getRemoteConfig, getValue } from 'firebase/remote-config';
import { RoleName } from '../role/roles';
import { BaseProperty } from '@bk/util';

export class MenuItemModel extends BaseModel {
  //  name: e.g. aoc, help, members ...
  // category: MenuAction, the action that should be taken when the menu item is clicked
  // url: string, the url that should be navigated to when the menu item is clicked
  public label = ''; // label (i18n), the text that the users sees on the menu item title
  public icon = 'help-circle-outline';
  public data?: BaseProperty[];
  public menuItems?: string[]; // the keys of the sub menu items
  public roleNeeded?: RoleName;

  constructor() {
    super();
    this.modelType = ModelType.MenuItem;
    const _remoteConfig = getRemoteConfig();
    this.tenant = [getValue(_remoteConfig, 'tenant_id').asString()];
  }
}
