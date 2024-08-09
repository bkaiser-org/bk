import { enforce, omitWhen, only, staticSuite, test} from 'vest';
import { ibanValidations } from '../fields/iban.validations';
import { tagsValidations } from '../fields/tags.validations';
import { stringValidations } from '../primitive-validations/string.validations';
import { CITY_LENGTH, COUNTRY_LENGTH, DESCRIPTION_LENGTH, SHORT_NAME_LENGTH, STREET_LENGTH, ZIP_LENGTH, isAfterDate } from '@bk/util';
import { categoryValidations } from '../primitive-validations/category.validations';
import { dateValidations } from '../primitive-validations/date.validations';
import { OrgNewFormModel } from './org-new.model';
import { phoneValidations } from '../fields/phone.validations';
import { emailValidations } from '../fields/email.validations';
import { ModelType, OrgType } from '@bk/categories';

export const orgNewValidations = staticSuite((model: OrgNewFormModel, field?: string) => {
  if (field) only(field);

  stringValidations('orgName', model.orgName, SHORT_NAME_LENGTH, 3, true);
  categoryValidations('orgType', model.orgType, OrgType);
  dateValidations('dateOfFoundation', model.dateOfFoundation);
  dateValidations('dateOfLiquidation', model.dateOfLiquidation);
  stringValidations('street', model.street, STREET_LENGTH);
  stringValidations('countryCode', model.countryCode, COUNTRY_LENGTH, COUNTRY_LENGTH);
  stringValidations('zipCode', model.zipCode, ZIP_LENGTH, ZIP_LENGTH);
  stringValidations('city', model.city, CITY_LENGTH);
  phoneValidations('phone', model.phone);
  emailValidations('email', model.email);
  stringValidations('taxId', model.taxId, SHORT_NAME_LENGTH);
  ibanValidations('iban', model.iban);
  stringValidations('notes', model.notes, DESCRIPTION_LENGTH);
  tagsValidations('tags', model.tags);

  test('modelType', 'orgModelType', () => {
    enforce(model.modelType).equals(ModelType.Org);
  });

  // cross field validations
  omitWhen(model.dateOfLiquidation === '' || model.dateOfFoundation === '', () => {
    test('dateOfLiquidation', 'orgLiguidationAfterFoundation', () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      enforce(isAfterDate(model.dateOfLiquidation!, model.dateOfFoundation!)).isTruthy();
    });
  });
  omitWhen(model.zipCode === '', () => {
    test('city', 'orgZipRequiresCity', () => {
      enforce(model.city).isNotEmpty();
    });
    test('countryCode', 'orgZipRequiredCountry', () => {
      enforce(model.countryCode).isNotEmpty();
    })
  });
  omitWhen(model.city === '', () => {
    test('zipCode', 'orgCityRequiresZip', () => {
      enforce(model.zipCode).isNotEmpty();
    });
    test('zipCode', 'orgZipRequiredCountry', () => {
      enforce(model.countryCode).isNotEmpty();
    })
  });
  omitWhen(model.zipCode === '' || model.countryCode !== 'CH', () => {
    test('zipCode', 'orgSwissZipNumeric', () => {
      enforce(model.zipCode).isNumeric();
    });
    test('zipCode', 'orgSwissZipLength', () => {
      enforce(model.zipCode?.length).equals(4);
    })
  });

  // cross collection validations
  // tbd: cross reference bkey in subjects
  // tbd: match zipcode and city from swisscities dictionary

});






