import { only, staticSuite} from 'vest';
import { SectionFormModel } from './section-form.model';
import { stringValidations } from '../primitive-validations/string.validations';
import { DESCRIPTION_LENGTH, SHORT_NAME_LENGTH } from '@bk/util';
import { urlValidations } from '../fields/url.validations';
import { categoryValidations } from '../primitive-validations/category.validations';
import { ColorIonic, RoleEnum, ViewPosition } from '@bk/categories';
import { tagsValidations } from '../fields/tags.validations';
import { numberValidations } from '../primitive-validations/number.validations';

export const sectionFormValidations = staticSuite((model: SectionFormModel, field?: string) => {
  if (field) only(field);

  stringValidations('bkey', model.bkey, SHORT_NAME_LENGTH);
  stringValidations('name', model.bkey, SHORT_NAME_LENGTH);
  numberValidations('colSize', model.colSize, true, 1, 6);
  urlValidations('url', model.url);
  categoryValidations('imagePosition', model.imagePosition, ViewPosition);
  stringValidations('content', model.content, DESCRIPTION_LENGTH);
  tagsValidations('tags', model.tags);
  stringValidations('notes', model.notes, DESCRIPTION_LENGTH);
  categoryValidations('roleNeeded', model.roleNeeded, RoleEnum);
  categoryValidations('color', model.color, ColorIonic);
});
