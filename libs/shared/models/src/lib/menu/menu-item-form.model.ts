import { MenuAction, RoleEnum } from "@bk/categories";
import { BaseProperty } from "@bk/util";
import { DeepRequired } from 'ngx-vest-forms';

// can not use the DeepPartial from ngx-vest-forms because it is not compatible with BaseProperty[].
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DeepPartial<T> = T extends any[]? T : T extends Record<string, any> ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export type MenuItemFormModel = DeepPartial<{
    bkey: string,
    name: string,
    category: MenuAction,
    label: string,
    icon: string,
    data: BaseProperty[],
    menuItems: string[],
    roleNeeded: RoleEnum,
    url: string,
    notes: string,
    tags: string,
    tenant: string
}>;

export const menuItemFormModelShape: DeepRequired<MenuItemFormModel> = {
    bkey: '',
    name: '',
    category: 0,
    label: '',
    icon: '',
    data: [],
    menuItems: [],
    roleNeeded: RoleEnum.None,
    url: '',
    notes: '',
    tags: '',
    tenant: ''
};