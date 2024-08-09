
import { only, staticSuite} from 'vest';
import { BaseModel } from './base.model';
import { categoryValidations } from '../primitive-validations/category.validations';
import { urlValidations } from '../fields/url.validations';
import { tagsValidations } from '../fields/tags.validations';
import { tenantValidations } from '../fields/tenant.validations';
import { stringValidations } from '../primitive-validations/string.validations';
import { DESCRIPTION_LENGTH, LONG_NAME_LENGTH, SHORT_NAME_LENGTH } from '@bk/util';
import { numberValidations } from '../primitive-validations/number.validations';
import { booleanValidations } from '../primitive-validations/boolean.validations';
import { ModelType } from '@bk/categories';


export const baseValidations = staticSuite((model: BaseModel, field?: string) => {
  if (field) only(field);

  stringValidations('bkey', model.bkey, SHORT_NAME_LENGTH);
  stringValidations('name', model.name, SHORT_NAME_LENGTH);
  tenantValidations(model.tenant);
  numberValidations('category', model.category, true, -1, 100);
  urlValidations('url', model.url);
  stringValidations('index', model.index, LONG_NAME_LENGTH);
  booleanValidations('isArchived', model.isArchived, false);
  booleanValidations('isTest', model.isTest, false);
  tagsValidations('tags', model.tags);
  stringValidations('description', model.description, DESCRIPTION_LENGTH);
  categoryValidations('modelType', model.modelType, ModelType);
});
