import { Category } from "./category-model";

export type MenuActionCategory = Category; 

export enum MenuAction {
  Navigate,
  Browse,
  Logout,
  SubMenu,
  Divider,
  MainMenu,
  Login
}

export const MenuActions: MenuActionCategory[] = [
{
  id: MenuAction.Navigate,
  abbreviation: 'NAV',
  name: 'navigate',
  i18nBase: 'content.menuAction.navigate',
  icon: 'compass-outline'
},
{
  id: MenuAction.Browse,
  abbreviation: 'BRWS',
  name: 'browse',
  i18nBase: 'content.menuAction.browse',
  icon: 'earth-outline'
},
{
  id: MenuAction.Logout,
  abbreviation: 'LOGOUT',
  name: 'logout',
  i18nBase: 'content.menuAction.logout',
  icon: 'log-out-outline'
},
{
  id: MenuAction.SubMenu,
  abbreviation: 'SM',
  name: 'submenu',
  i18nBase: 'content.menuAction.submenu',
  icon: 'menu-outline'
},
{
  id: MenuAction.Divider,
  abbreviation: 'DIV',
  name: 'divider',
  i18nBase: 'content.menuAction.divider',
  icon: 'remove-outline'
},
{
  id: MenuAction.MainMenu,
  abbreviation: 'MAIN',
  name: '',
  i18nBase: 'content.menuAction.mainMenu',
  icon: 'menu-outline'
},
{
  id: MenuAction.Login,
  abbreviation: 'LOGIN',
  name: 'login',
  i18nBase: 'content.menuAction.login',
  icon: 'log-in-outline'
}
];
