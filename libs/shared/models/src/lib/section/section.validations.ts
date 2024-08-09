import { enforce, omitWhen, only, staticSuite, test} from 'vest';
import { categoryValidations } from '../primitive-validations/category.validations';
import { SectionModel } from './section.model';
import { DESCRIPTION_LENGTH, SHORT_NAME_LENGTH } from '@bk/util';
import { stringValidations } from '../primitive-validations/string.validations';
import { ColorIonic, ModelType, SectionType, ViewPosition } from '@bk/categories';
import { baseValidations } from '../base/base.validations';
import { numberValidations } from '../primitive-validations/number.validations';

export const sectionValidations = staticSuite((model: SectionModel, field?: string) => {
  if (field) only(field);

  baseValidations(model);
  stringValidations('name', model.name, SHORT_NAME_LENGTH);
  categoryValidations('category', model.category, SectionType);
  stringValidations('content', model.content, DESCRIPTION_LENGTH);
  numberValidations('colSize', model.colSize, true, 1, 6);
  categoryValidations('imagePosition', model.imagePosition, ViewPosition);
  categoryValidations('color', model.color, ColorIonic);

  test('modelType', 'sectionModelType', () => {
    enforce(model.modelType).equals(ModelType.Section);
  });

  omitWhen(model.roleNeeded === undefined, () => {
    test('roleNeeded', 'menuRoleNeededMandatory', () => {
      enforce(typeof(model.roleNeeded)).equals('RoleName');
    });
  });
});

// tbd: validate properties

