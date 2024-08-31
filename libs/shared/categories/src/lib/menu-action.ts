import { Category } from "./category-model";

export type MenuActionCategory = Category; 

export enum MenuAction {
  Navigate,
  Browse,
  SubMenu,
  Divider,
  MainMenu
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
}
];
