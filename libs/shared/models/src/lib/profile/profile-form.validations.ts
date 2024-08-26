/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { enforce, omitWhen, only, staticSuite, test} from 'vest';
import { ProfileFormModel } from './profile-form.model';
import { ssnValidations } from '../fields/ssn.validations';
import { urlValidations } from '../fields/url.validations';
import { stringValidations } from '../primitive-validations/string.validations';
import { SHORT_NAME_LENGTH, isFutureDate } from '@bk/util';
import { categoryValidations } from '../primitive-validations/category.validations';
import { GenderType } from '@bk/categories';
import { dateValidations } from '../primitive-validations/date.validations';
import { booleanValidations } from '../primitive-validations/boolean.validations';

export const profileFormValidations = staticSuite((model: ProfileFormModel, field: string) => {
  only(field);

  stringValidations('bkey', model.bkey, SHORT_NAME_LENGTH);
  stringValidations('firstname', model.firstName, SHORT_NAME_LENGTH);
  stringValidations('lastname', model.lastName, SHORT_NAME_LENGTH);
  categoryValidations('gender', model.gender, GenderType);
  dateValidations('dateOfBirth', model.dateOfBirth);
  ssnValidations('ssn', model.ssn);
  urlValidations('url', model.url);
  stringValidations('userLanguage', model.userLanguage, 2);
  booleanValidations('showDebugInfo', model.showDebugInfo);
  booleanValidations('showTestData', model.showTestData);
  booleanValidations('showArchivedData', model.showArchivedData);

  omitWhen(model.dateOfBirth === '', () => {
    test('dateOfBirth', 'personDateOfBirthNotFuture', () => {
      enforce(isFutureDate(model.dateOfBirth!)).isFalsy();
    })
  });

  // cross field validations

  // cross collection validations
});

