import { enforce, omitWhen, only, staticSuite, test } from 'vest';
import { emailValidations } from '../fields/email.validations';
import { phoneValidations } from '../fields/phone.validations';
import { SubjectModel } from './subject.model';
import { GenderType, ModelType, OrgType } from '@bk/categories';
import { CITY_LENGTH, COUNTRY_LENGTH, SHORT_NAME_LENGTH, STREET_LENGTH, isAfterDate, isFutureDate } from '@bk/util';
import { stringValidations } from '../primitive-validations/string.validations';
import { dateValidations } from '../primitive-validations/date.validations';
import { ssnValidations } from '../fields/ssn.validations';
import { baseValidations } from '../base/base.validations';
import { categoryValidations } from '../primitive-validations/category.validations';
import 'vest/enforce/compounds';

export const subjectValidations = staticSuite((model: SubjectModel, field?: string) => {
  if (field) only(field);

  baseValidations(model);
  stringValidations('firstName', model.firstName, SHORT_NAME_LENGTH);
  dateValidations('dateOfBirth', model.dateOfBirth);
  dateValidations('dateOfDeath', model.dateOfDeath);
  stringValidations('street', model.fav_street, STREET_LENGTH);
  stringValidations('zipCode', model.fav_zip);
  stringValidations('city', model.fav_city, CITY_LENGTH);
  stringValidations('countryCode', model.fav_country, COUNTRY_LENGTH, COUNTRY_LENGTH);
  phoneValidations('phone', model.fav_phone);
  emailValidations('email', model.fav_email);
  stringValidations('bexioId', model.bexioId, SHORT_NAME_LENGTH);

  test('modelType', 'subjectModelType', () => {
    enforce(model.modelType).oneOf(
      enforce.numberEquals(ModelType.Person),
      enforce.numberEquals(ModelType.Org),
      enforce.numberEquals(ModelType.Group)
    );
  });

  omitWhen(model.modelType !== ModelType.Person, () => {
    ssnValidations('ssn', model.taxId);                               // taxId = ssn
    categoryValidations('gender', model.category, GenderType);
  });
  omitWhen(model.modelType !== ModelType.Org, () => {
    stringValidations('taxId', model.taxId, SHORT_NAME_LENGTH);       // taxId = vat 
    categoryValidations('orgType', model.category, OrgType);
  });
  omitWhen(model.modelType !== ModelType.Group, () => {
    stringValidations('taxId', model.taxId);                          // taxId should be empty
    test('taxId', 'taxId must be empty', () => {
      enforce(model.taxId).isEmpty();
    });
    test('orgType', 'subjectCategoryGroup', () => {
      enforce(model.category).equals(OrgType.Group);
    });
  });

  // cross field validations
  omitWhen(model.dateOfBirth === '', () => {
    test('dateOfBirth', 'personDateOfBirthNotFuture', () => {
      enforce(isFutureDate(model.dateOfBirth)).isFalsy();
    })
  });

  omitWhen(model.dateOfDeath === '', () => {
    test('dateOfDeath', 'personDateOfDeathNotFuture', () => {
      enforce(isFutureDate(model.dateOfDeath)).isFalsy();
    })
  });

  omitWhen(model.dateOfDeath === '' || model.dateOfBirth === '', () => {
    test('dateOfDeath', 'personDateOfDeathAfterBirth', () => {
      enforce(isAfterDate(model.dateOfDeath, model.dateOfBirth)).isTruthy();
    });
  });

  omitWhen(model.fav_zip === '', () => {
    test('city', 'personZipRequiresCity', () => {
      enforce(model.fav_city).isNotEmpty();
    });
    test('countryCode', 'personZipRequiresCountry', () => {
      enforce(model.fav_country).isNotEmpty();
    })
  });
  omitWhen(model.fav_city === '', () => {
    test('zipCode', 'personCityRequiresZip', () => {
      enforce(model.fav_zip).isNotEmpty();
    });
    test('zipCode', 'personZipRequiresCountry', () => {
      enforce(model.fav_country).isNotEmpty();
    })
  });
  omitWhen(model.fav_zip === '' || model.fav_country !== 'CH', () => {
    test('zipCode', 'personSwissZipNumeric', () => {
      enforce(model.fav_zip).isNumeric();
    });
    test('zipCode', 'personSwissZipLength', () => {
      enforce(model.fav_zip.length).equals(4);
    })
  });
});

// tbd: match zipcode and city from swisscities dictionary

