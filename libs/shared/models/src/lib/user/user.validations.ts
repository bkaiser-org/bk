import { only, staticSuite} from 'vest';
import { UserModel } from './user.model';
import { baseValidations } from '../base/base.validations';
import { stringValidations } from '../primitive-validations/string.validations';
import { NameDisplay, SHORT_NAME_LENGTH } from '@bk/util';
import { booleanValidations } from '../primitive-validations/boolean.validations';
import { numberValidations } from '../primitive-validations/number.validations';
import { categoryValidations } from '../primitive-validations/category.validations';
import { AvatarUsage, DeliveryType, PersonSortCriteria } from '@bk/categories';

export const userValidations = staticSuite((model: UserModel, field?: string) => {
  if (field) only(field);

  baseValidations(model, field);
  stringValidations('loginEmail', model.loginEmail, SHORT_NAME_LENGTH);
  stringValidations('personKey', model.personKey, SHORT_NAME_LENGTH);
  stringValidations('personName', model.personName, SHORT_NAME_LENGTH);
  booleanValidations('useTouchId', model.useTouchId);
  booleanValidations('useFaceId', model.useFaceId);
  stringValidations('userLanguage', model.userLanguage, 2);
  numberValidations('toastLength', model.toastLength, true, 0, 10000);
  categoryValidations('avatarUsage', model.avatarUsage, AvatarUsage);
  stringValidations('gravatarEmail', model.gravatarEmail, SHORT_NAME_LENGTH);
  categoryValidations('nameDisplay', model.nameDisplay, NameDisplay);
  categoryValidations('personSortCriteria', model.personSortCriteria, PersonSortCriteria);
  categoryValidations('newsDelivery', model.newsDelivery, DeliveryType);
  categoryValidations('invoiceDelivery', model.invoiceDelivery, DeliveryType);
  booleanValidations('showArchivedData', model.showArchivedData);
  booleanValidations('showTestData', model.showTestData);
  booleanValidations('showDebugInfo', model.showDebugInfo);
});
