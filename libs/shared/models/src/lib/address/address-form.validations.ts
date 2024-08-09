import { enforce, omitWhen, only, staticSuite, test} from 'vest';
import { tagsValidations } from '../fields/tags.validations';
import { stringValidations } from '../primitive-validations/string.validations';
import { CITY_LENGTH, COUNTRY_LENGTH, DESCRIPTION_LENGTH, SHORT_NAME_LENGTH, STREET_LENGTH, ZIP_LENGTH } from '@bk/util';
import { booleanValidations } from '../primitive-validations/boolean.validations';
import { categoryValidations } from '../primitive-validations/category.validations';
import { AddressChannel, AddressUsage } from '@bk/categories';
import { AddressFormModel } from './address-form.model';
import { urlValidations } from '../fields/url.validations';
import { ibanValidations } from '../fields/iban.validations';

export const addressFormValidations = staticSuite((model: AddressFormModel, field?: string) => {
  if (field) only(field);

  stringValidations('bkey', model.bkey, SHORT_NAME_LENGTH);
  categoryValidations('addressChannel', model.addressChannel, AddressChannel);
  stringValidations('addressChannelLabel', model.addressChannelLabel, SHORT_NAME_LENGTH);
  categoryValidations('addressUsage', model.addressUsage, AddressUsage);
  stringValidations('addressUsageLabel', model.addressUsageLabel, SHORT_NAME_LENGTH);
  stringValidations('addressValue', model.addressValue, SHORT_NAME_LENGTH);
  ibanValidations('iban', model.iban);

  omitWhen(model.addressChannel === AddressChannel.Postal, () => {
    test('addressValue', 'addressValueMandatoryForNonPostal', () => {
      enforce(model.addressValue).isNotBlank();
    })
  });
  omitWhen(model.addressChannel !== AddressChannel.Postal, () => {
    stringValidations('addressValue2', model.addressValue2, SHORT_NAME_LENGTH);
    stringValidations('street', model.street, STREET_LENGTH);
    stringValidations('zipCode', model.zipCode, ZIP_LENGTH, ZIP_LENGTH);
    stringValidations('city', model.city, CITY_LENGTH);
    stringValidations('countryCode', model.countryCode, COUNTRY_LENGTH, COUNTRY_LENGTH);
  });

  booleanValidations('isFavorite', model.isFavorite);
  booleanValidations('isCc', model.isCc);
  booleanValidations('isValidated', model.isValidated);
  urlValidations('url', model.url);
  stringValidations('notes', model.notes, DESCRIPTION_LENGTH);
  tagsValidations('tags', model.tags);
  stringValidations('parentKey', model.parentKey, SHORT_NAME_LENGTH, 0, true);
});


