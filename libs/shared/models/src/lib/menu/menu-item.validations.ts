
import { enforce, omitWhen, only, staticSuite, test} from 'vest';
import { categoryValidations } from '../primitive-validations/category.validations';
import { MenuItemModel } from './menu-item.model';
import { MenuAction, ModelType } from '@bk/categories';
import { stringValidations } from '../primitive-validations/string.validations';
import { SHORT_NAME_LENGTH, isArrayOfBaseProperties, isArrayOfStrings } from '@bk/util';
import { baseValidations } from '../base/base.validations';

export const menuItemValidation = staticSuite((model: MenuItemModel, field?: string) => {
  if (field) only(field);

  baseValidations(model, field);
  stringValidations('label', model.label, SHORT_NAME_LENGTH);
  stringValidations('icon', model.icon, SHORT_NAME_LENGTH);
  categoryValidations('category', model.category, MenuAction);
  stringValidations('tenant', model.tenant, SHORT_NAME_LENGTH);

  test('modelType', 'menuModelType', () => {
    enforce(model.modelType).equals(ModelType.Menu);
  });

  omitWhen(model.roleNeeded === undefined, () => {
    test('roleNeeded', 'menuRoleNeededMandatory', () => {
      enforce(typeof(model.roleNeeded)).equals('RoleName');
    });
  });

  omitWhen(model.data === undefined, () => {
    test('data', 'menuDataProperty', () => {
      enforce(isArrayOfBaseProperties(model.data)).isTruthy();
    });
  });

  omitWhen(model.category !== MenuAction.SubMenu, () => {
    test('menuItems', 'Die Sub-Menu-Einträge fehlen.', () => {
      enforce(model.menuItems).isNotUndefined();
    });
  });

  omitWhen(model.menuItems === undefined, () => {
    test('menuItems', 'Menu Items müssen vom Typ String[] sein.', () => {
      enforce(isArrayOfStrings(model.menuItems)).isTruthy();
    });
  });

  // if MenuAction.Navigate|Browse -> url must be defined
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  omitWhen(model.category! > MenuAction.Browse, () => {
    test('menuItems', 'menuItemsEmptySubMenu', () => {
      enforce(model.menuItems).isEmpty();
    });
  });  


  // if MenuAction.Navigate|Browse|SubMenu -> roleNeeded must be defined
  omitWhen(model.category > MenuAction.SubMenu, () => {
    test('roleNeeded', 'Die Angabe der benötigten Rolle ist obligatorisch.', () => {
      enforce(model.roleNeeded).isNotUndefined();
    });
  });
});

