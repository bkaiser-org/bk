/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { enforce, omitWhen, only, staticSuite, test} from 'vest';
import { PersonNewFormModel } from './person-new.model';
import { ssnValidations } from '../fields/ssn.validations';
import { emailValidations } from '../fields/email.validations';
import { phoneValidations } from '../fields/phone.validations';
import { tagsValidations } from '../fields/tags.validations';
import { stringValidations } from '../primitive-validations/string.validations';
import { categoryValidations } from '../primitive-validations/category.validations';
import { dateValidations } from '../primitive-validations/date.validations';
import { GenderType, MemberType, ModelType, OrgKey, ScsMemberType } from '@bk/categories';
import { CITY_LENGTH, COUNTRY_LENGTH, DESCRIPTION_LENGTH, SHORT_NAME_LENGTH, STREET_LENGTH, ZIP_LENGTH, isAfterDate, isFutureDate } from '@bk/util';

export const personNewValidations = staticSuite((model: PersonNewFormModel, field?: string) => {
  if (field) only(field);

  stringValidations('firstName', model.firstName, SHORT_NAME_LENGTH);
  stringValidations('lastName', model.lastName, SHORT_NAME_LENGTH);
  categoryValidations('gender', model.gender, GenderType);
  dateValidations('dateOfBirth', model.dateOfBirth);
  dateValidations('dateOfDeath', model.dateOfDeath);
  stringValidations('street', model.street, STREET_LENGTH);
  stringValidations('countryCode', model.countryCode, COUNTRY_LENGTH, COUNTRY_LENGTH);
  stringValidations('zipCode', model.zipCode, ZIP_LENGTH, ZIP_LENGTH);
  stringValidations('city', model.city, CITY_LENGTH);
  phoneValidations('phone', model.phone);
  emailValidations('email', model.email);
  ssnValidations('ssn', model.ssn);
  stringValidations('notes', model.notes, DESCRIPTION_LENGTH);
  tagsValidations('tags', model.tags);
  test('modelType', 'modelType must be Person', () => {
    enforce(model.modelType).equals(ModelType.Person);
  });

  stringValidations('orgId', model.orgId, SHORT_NAME_LENGTH);
  dateValidations('dateOfEntry', model.dateOfEntry);
  dateValidations('dateOfExit', model.dateOfExit);
  if(model.orgId === OrgKey.SCS) {
    categoryValidations('memberCategory', model.memberCategory, ScsMemberType); 
  } else {
    categoryValidations('memberCategory', model.memberCategory, MemberType); 
  }

  stringValidations('function', model.function, SHORT_NAME_LENGTH);
  stringValidations('abbreviation', model.abbreviation, SHORT_NAME_LENGTH);
  stringValidations('nickName', model.nickName, SHORT_NAME_LENGTH);

  // cross field validations
  omitWhen(model.dateOfBirth === '', () => {
    test('dateOfBirth', 'dateOfBirth must be in the past', () => {
      enforce(isFutureDate(model.dateOfBirth!)).isFalsy();
    })
  });

  omitWhen(model.dateOfDeath === '', () => {
    test('dateOfDeath', 'dateOfDeath must be in the past', () => {
      enforce(isFutureDate(model.dateOfDeath!)).isFalsy();
    })
  });

  omitWhen(model.dateOfDeath === '' || model.dateOfBirth === '', () => {
    test('dateOfDeath', 'death must be after birth', () => {
      enforce(isAfterDate(model.dateOfDeath!, model.dateOfBirth!)).isTruthy();
    });
  });

  omitWhen(model.zipCode === '', () => {
    test('city', 'zipCode requires a city', () => {
      enforce(model.city).isNotEmpty();
    });
    test('countryCode', 'zipCode requires a countryCode', () => {
      enforce(model.countryCode).isNotEmpty();
    })
  });
  omitWhen(model.city === '', () => {
    test('zipCode', 'city requires a zipCode', () => {
      enforce(model.zipCode).isNotEmpty();
    });
    test('zipCode', 'city requires a countryCode', () => {
      enforce(model.countryCode).isNotEmpty();
    })
  });
  omitWhen(model.zipCode === '' || model.countryCode !== 'CH', () => {
    test('zipCode', 'a swiss zipCode must be a numeric string', () => {
      enforce(model.zipCode).isNumeric();
    });
    test('zipCode', 'a swiss zipCode must be 4 numbers long', () => {
      enforce(model.zipCode!.length).equals(4);
    })
  });

  omitWhen(model.dateOfEntry === '' || model.dateOfExit === '', () => {
    test('dateOfExit', 'exit must be after entry', () => {
      enforce(isAfterDate(model.dateOfExit!, model.dateOfEntry!)).isTruthy();
    });
  });

  // cross collection validations
  // tbd: cross reference orgId with subjects, if OrgId is set other fields are mandatory
  // tbd: match zipcode and city from swisscities dictionary

});


