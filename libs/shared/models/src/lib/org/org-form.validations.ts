import { enforce, omitWhen, only, staticSuite, test} from 'vest';
import { ibanValidations } from '../fields/iban.validations';
import { tagsValidations } from '../fields/tags.validations';
import { urlValidations } from '../fields/url.validations';
import { OrgFormModel } from './org-form.model';
import { stringValidations } from '../primitive-validations/string.validations';
import { DESCRIPTION_LENGTH, SHORT_NAME_LENGTH, isAfterDate } from '@bk/util';
import { categoryValidations } from '../primitive-validations/category.validations';
import { dateValidations } from '../primitive-validations/date.validations';
import { ModelType, OrgType } from '@bk/categories';

export const orgFormValidations = staticSuite((model: OrgFormModel, field?: string) => {
  if (field) only(field);

  stringValidations('bkey', model.bkey, SHORT_NAME_LENGTH);
  stringValidations('orgName', model.orgName, SHORT_NAME_LENGTH, 3, true);
  categoryValidations('orgType', model.orgType, OrgType);
  dateValidations('dateOfFoundation', model.dateOfFoundation);
  dateValidations('dateOfLiquidation', model.dateOfLiquidation);
  ibanValidations('iban', model.iban);
  stringValidations('taxId', model.taxId, SHORT_NAME_LENGTH);
  urlValidations('url', model.url);
  stringValidations('bexioId', model.bexioId, SHORT_NAME_LENGTH);
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
  // tbd: city is mandatory if zipCode is set -> lookup from swisscities


  // cross collection validations
  // tbd: cross reference bkey in subjects
});


