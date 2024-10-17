import { enforce, only, staticSuite, test} from 'vest';
import { stringValidations } from '../primitive-validations/string.validations';
import { DESCRIPTION_LENGTH, isArrayOfStrings, SHORT_NAME_LENGTH } from '@bk/util';
import { tagsValidations } from '../fields/tags.validations';
import { PageFormModel } from './page-form.model';
import { tenantValidations } from '../fields/tenant.validations';

export const pageFormValidations = staticSuite((model: PageFormModel, field?: string) => {
  if (field) only(field);

  stringValidations('bkey', model.bkey, SHORT_NAME_LENGTH);
  stringValidations('name', model.bkey, SHORT_NAME_LENGTH);
  tagsValidations('tags', model.tags);
  stringValidations('notes', model.notes, DESCRIPTION_LENGTH);
  tenantValidations(model.tenant);

  test('sections', 'sections must be of type string[]', () => {
    enforce(isArrayOfStrings(model.sections)).isTruthy();
  });
});
