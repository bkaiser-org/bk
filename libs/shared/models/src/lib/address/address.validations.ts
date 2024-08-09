import { enforce, omitWhen, only, staticSuite, test} from 'vest';
import { AddressModel } from './address.model';
import { categoryValidations } from '../primitive-validations/category.validations';
import { tagsValidations } from '../fields/tags.validations';
import { stringValidations } from '../primitive-validations/string.validations';
import { CITY_LENGTH, COUNTRY_LENGTH, DESCRIPTION_LENGTH, LONG_NAME_LENGTH, SHORT_NAME_LENGTH, URL_LENGTH, ZIP_LENGTH } from '@bk/util';
import { booleanValidations } from '../primitive-validations/boolean.validations';
import { AddressChannel, AddressUsage, ModelType } from '@bk/categories';
import { baseValidations } from '../base/base.validations';

export const addressValidations = staticSuite((model: AddressModel, field?: string) => {
  if (field) only(field);

  baseValidations(model, field);
  categoryValidations('category (addressChannel)', model.category, AddressChannel);
  stringValidations('addressChannelLabel', model.addressChannelLabel, SHORT_NAME_LENGTH);
  categoryValidations('addressUsage', model.addressUsage, AddressUsage);
  stringValidations('addressUsageLabel', model.addressUsageLabel, SHORT_NAME_LENGTH);
  stringValidations('url (addressChannelIcon)', model.url, URL_LENGTH);
  stringValidations('name (addressValue)', model.name, LONG_NAME_LENGTH);
  stringValidations('addressValue2', model.addressValue2, SHORT_NAME_LENGTH);
  stringValidations('zipCode', model.zipCode, ZIP_LENGTH);
  stringValidations('city', model.city, CITY_LENGTH);
  stringValidations('countryCode', model.countryCode, COUNTRY_LENGTH);
  booleanValidations('isFavorite', model.isFavorite);
  booleanValidations('isCc', model.isCc);
  booleanValidations('isValidated', model.isValidated);
  stringValidations('description', model.description, DESCRIPTION_LENGTH);
  tagsValidations('tags', model.tags);
  stringValidations('parentKey', model.parentKey, SHORT_NAME_LENGTH, 0, true);

  test('modelType', 'addressModelType', () => {
    enforce(model.modelType).equals(ModelType.Address);
  });
  test('name', 'addressValueMandatory', () => {
    enforce(model.name).isNotEmpty();
  });

  // cross validations
  omitWhen(model.category !== AddressChannel.Custom, () => {
    test('addressChannelLabel', 'addressCustomChannelLabelMandatory', () => {
      enforce(model.addressChannelLabel).isNotEmpty();
    })
  });
  omitWhen(model.addressUsage !== AddressUsage.Custom, () => {
    test('addressUsageLabel', 'addressCustomUsageLabelMandatory', () => {
      enforce(model.addressUsageLabel).isNotEmpty();
    })
  });

  omitWhen(model.category !== AddressChannel.Postal, () => {
    test('zipCode', 'addressZipCodeMandatory', () => {
      enforce(model.zipCode).isNotEmpty();
    });
    test('city', 'addressCityMandatory', () => {
      enforce(model.city).isNotEmpty;
    });
    test('countryCode', 'addressCountryMandatory', () => {
      enforce(model.countryCode).isNotEmpty;
    });
    test('countryCode', 'addressCountryUppercase', () => {
      enforce(model.countryCode).equals(model.countryCode.toUpperCase());
    });
    test('countryCode', 'addressCountryLength', () => {
      enforce(model.countryCode.length).equals(2);
    });
    omitWhen(model.countryCode !== 'CH', () => {
      test('zipCode', 'addressSwissZipCodeNumeric', () => {
        enforce(model.zipCode).isNumeric();
      });
      test('zipCode', 'addressSwissZipCodeLength', () => {
        enforce(model.zipCode.length).equals(4);
      })
    });
  });
});

// tbd: check that only one address is favorite per type (phone, email, postal)