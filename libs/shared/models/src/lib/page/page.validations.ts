import { enforce, only, staticSuite, test} from 'vest';
import { PageModel } from './page.model';
import { baseValidations } from '../base/base.validations';
import { ModelType } from '@bk/categories';

export const pageValidations = staticSuite((model: PageModel, field?: string) => {
  if (field) only(field);

  baseValidations(model, field);

  test('modelType', 'pageModelType', () => {
    enforce(model.modelType).equals(ModelType.Page);
  });

// tbd: validate sections
// which non-existent sections are referenced in the page ?
// which sections are not referenced by any page (orphaned sections)

});


