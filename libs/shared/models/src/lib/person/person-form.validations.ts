import { enforce, omitWhen, only, staticSuite, test} from 'vest';
import { PersonFormModel } from './person-form.model';
import { ssnValidations } from '../fields/ssn.validations';
import { tagsValidations } from '../fields/tags.validations';
import { urlValidations } from '../fields/url.validations';
import { stringValidations } from '../primitive-validations/string.validations';
import { categoryValidations } from '../primitive-validations/category.validations';
import { dateValidations } from '../primitive-validations/date.validations';
import { DESCRIPTION_LENGTH, SHORT_NAME_LENGTH, isAfterDate, isFutureDate } from '@bk/util';
import { GenderType, ModelType } from '@bk/categories';

export const personFormValidations = staticSuite((model: PersonFormModel, field?: string) => {
  if (field) only(field);

  stringValidations('bkey', model.bkey, SHORT_NAME_LENGTH);
  stringValidations('firstName', model.firstName, SHORT_NAME_LENGTH);
  stringValidations('lastName', model.lastName, SHORT_NAME_LENGTH);
  categoryValidations('gender', model.gender, GenderType);
  dateValidations('dateOfBirth', model.dateOfBirth);
  dateValidations('dateOfDeath', model.dateOfDeath);
  ssnValidations('ssn', model.ssn);
  urlValidations('url', model.url);
  stringValidations('bexioId', model.bexioId, SHORT_NAME_LENGTH);
  stringValidations('notes', model.notes, DESCRIPTION_LENGTH);
  tagsValidations('tags', model.tags);
  categoryValidations('modelType', model.modelType, ModelType);

  test('modelType', 'personModelType', () => {
    enforce(model.modelType).equals(ModelType.Person);
  });

  // cross field validations
  omitWhen(model.dateOfBirth === '', () => {
    test('dateOfBirth', 'personDateOfBirthNotFuture', () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      enforce(isFutureDate(model.dateOfBirth!)).isFalsy();
    })
  });

  omitWhen(model.dateOfDeath === '', () => {
    test('dateOfDeath', 'personDateOfDeathNotFuture', () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      enforce(isFutureDate(model.dateOfDeath!)).isFalsy();
    })
  });

  omitWhen(model.dateOfDeath === '' || model.dateOfBirth === '', () => {
    test('dateOfDeath', 'personDateOfDeathAfterBirth', () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      enforce(isAfterDate(model.dateOfDeath!, model.dateOfBirth!)).isTruthy();
    });
  })
  // cross collection validations
});

