import { SHORT_NAME_LENGTH, isArrayOfBaseProperties, isArrayOfStrings } from "@bk/util";
import { stringValidations } from "../primitive-validations/string.validations";
import { urlValidations } from "../fields/url.validations";
import { categoryValidations } from "../primitive-validations/category.validations";
import { MenuAction, RoleEnum } from "@bk/categories";
import { enforce, omitWhen, only, staticSuite, test } from "vest";
import { MenuItemFormModel } from "./menu-item-form.model";

export const menuItemFormValidation = staticSuite((model: MenuItemFormModel, field?: string) => {
  if (field) only(field);

  stringValidations('bkey', model.bkey, SHORT_NAME_LENGTH, 4, true);
  stringValidations('name', model.name, SHORT_NAME_LENGTH, 4, true);
  urlValidations('url', model.url);
  stringValidations('label', model.label, SHORT_NAME_LENGTH);
  stringValidations('icon', model.icon, SHORT_NAME_LENGTH);
  categoryValidations('category', model.category, MenuAction);
  stringValidations('tenant', model.tenant, SHORT_NAME_LENGTH);
  categoryValidations('roleNeeded', model.roleNeeded, RoleEnum);

  omitWhen(model.data === undefined, () => {
    test('data', 'menuDataProperty', () => {
      enforce(isArrayOfBaseProperties(model.data)).isTruthy();
    });
  });

  omitWhen(model.category !== MenuAction.SubMenu, () => {
    test('menuItems', 'menuSubMenuItemsMissing', () => {
      enforce(model.menuItems).isNotUndefined();
    });
  });
  
  omitWhen(model.menuItems === undefined, () => {
    test('menuItems', 'menuTypeString', () => {
      enforce(isArrayOfStrings(model.menuItems)).isTruthy();
    });
  });

  // if MenuAction.Navigate|Browse|Logout -> url must be defined
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  omitWhen(model.category! > MenuAction.Logout, () => {
    test('menuItems', 'menuItemsEmptySubMenu', () => {
      enforce(model.menuItems).isEmpty();
    });
  });  

  // if MenuAction.Navigate|Browse|SubMenu -> roleNeeded must be defined
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  omitWhen(model.category! > MenuAction.SubMenu || model.category === MenuAction.Logout, () => {
    test('roleNeeded', 'menuRoleNeededMandatory', () => {
      enforce(model.roleNeeded).isNotUndefined();
    });
  });
});
