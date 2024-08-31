import { Router } from '@angular/router';
import { die, getPropertyValue, navigateByUrl, warn } from '@bk/util';
import { Browser } from '@capacitor/browser';
import { MenuAction, MenuActions, RoleEnum, RoleEnums, getCategoryAbbreviation } from '@bk/categories';
import { MenuItemFormModel, MenuItemModel, RoleName } from '@bk/models';
import { AuthService } from '@bk/auth';

export function newMenuItem(name: string, label: string, icon = 'help-circle-outline'): MenuItemModel {
  const _menuItem = new MenuItemModel();
  _menuItem.bkey = name;
  _menuItem.category = MenuAction.Navigate;
  _menuItem.name = name;
  _menuItem.label = label;
  _menuItem.icon = icon;
  _menuItem.data = [];
  _menuItem.index = getMenuItemSearchIndex(_menuItem);
  return _menuItem;
}

export async function menuActionNavigate(router: Router, menuItem: MenuItemModel): Promise<void> {
  await navigateByUrl(router, menuItem.url, menuItem.data);
}

export function menuActionBrowse(url: string, target = '_blank'): Promise<void> {
  return Browser.open({ url: url, windowName: target });
}

export function getMenuItemSearchIndex(menuItem: MenuItemModel): string {
  return 'n:' + menuItem.name + ' m:' + getCategoryAbbreviation(MenuActions, menuItem.category);
}

export function getMenuItemSearchIndexInfo(): string {
  return 'n:ame m:enuAction';
}

export function getMenuItemTitle(menuItemKey: string | undefined): string {
  const _operation = !menuItemKey ? 'create' : 'update';
  return `@content.menuItem.operation.${_operation}.label`;  
}

export function newMenuItemFormModel(): MenuItemFormModel {
  return {
    name: '',
    category: MenuAction.Navigate,
    label: '',
    icon: 'help-circle-outline',
    url: '',
    notes: '',
    data: [],
    tags: '',
    tenant: ''
  }
}

export function convertMenuItemToForm(menuItem: MenuItemModel | undefined): MenuItemFormModel {
  if (!menuItem) return newMenuItemFormModel();
  return {
    bkey: menuItem.bkey,
    name: menuItem.name,
    category: menuItem.category,
    label: menuItem.label,
    icon: menuItem.icon,
    data: menuItem.data,
    menuItems: menuItem.menuItems ?? [],
    roleNeeded: convertRoleNameToEnum(menuItem.roleNeeded),
    url: menuItem.url,
    notes: menuItem.description,
    tags: menuItem.tags,
    tenant: menuItem.tenant
  }
}

export function convertFormToMenuItem(vm: MenuItemFormModel): MenuItemModel {
  const _menuItem = new MenuItemModel();
  _menuItem.name = vm.name ?? '';
  _menuItem.bkey = (!vm.bkey || vm.bkey.length === 0) ? vm.name : vm.bkey; // we want to use the name as the key of the menu item in the database
  _menuItem.category = vm.category ?? MenuAction.Navigate;
  _menuItem.label = vm.label ?? '';
  _menuItem.icon = vm.icon ?? 'help-circle-outline';
  _menuItem.data = vm.data ? vm.data : [];
  _menuItem.menuItems = vm.menuItems ?? [];
  const _roleNeeded = convertRoleEnumToName(vm.roleNeeded);
  if (_roleNeeded) _menuItem.roleNeeded = _roleNeeded;
  _menuItem.url = vm.url ?? '';
  _menuItem.description = vm.notes ?? '';
  _menuItem.tags = vm.tags ?? '';
  return _menuItem;
}

export function convertRoleNameToEnum(roleName?: RoleName): RoleEnum {
  if (!roleName) return RoleEnum.None;
  switch (roleName) {
    case 'none': return RoleEnum.None;
    case 'anonymous': return RoleEnum.Anonymous;
    case 'registered': return RoleEnum.Registered;
    case 'privileged': return RoleEnum.Privileged;
    case 'contentAdmin': return RoleEnum.ContentAdmin;
    case 'resourceAdmin': return RoleEnum.ResourceAdmin;
    case 'memberAdmin': return RoleEnum.MemberAdmin;
    case 'eventAdmin': return RoleEnum.EventAdmin;
    case 'treasurer': return RoleEnum.Treasurer;
    case 'admin': return RoleEnum.Admin;
    default: die('MenuUtil.convertRoleNameToEnum: invalid roleName=' + roleName);
  }
}

export function convertRoleEnumToName(roleEnum?: RoleEnum): RoleName | undefined {
  return roleEnum === undefined ? 'none' : RoleEnums[roleEnum].name as RoleName;
}

export function getTarget(menuItem: MenuItemModel): string {
  const _target = getPropertyValue(menuItem.data, 'target', '_blank');
  if (typeof _target === 'string') {
    return _target;
  } else {
    warn('MenuUtil.getTarget: target=<' + _target + '> is not a string, returning _blank.');
    return '_blank';
  }
}

export async function selectMenuItem(router: Router, menuItem: MenuItemModel): Promise<void> {
  switch (menuItem.category) {
    case MenuAction.Browse:
      await Browser.open({ url: menuItem.url, windowName: getTarget(menuItem) });
      break;
    case MenuAction.Navigate:
      await navigateByUrl(router, menuItem.url, menuItem.data);
      break;
    default:
      die('MenuUtil.select: invalid MenuAction=' + menuItem.category);
  }
}