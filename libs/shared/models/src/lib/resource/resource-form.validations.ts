import { enforce, only, staticSuite, test} from 'vest';
import { ResourceFormModel } from './resource-form.model';
import { stringValidations } from '../primitive-validations/string.validations';
import { DESCRIPTION_LENGTH, SHORT_NAME_LENGTH } from '@bk/util';
import { numberValidations } from '../primitive-validations/number.validations';
import { categoryValidations } from '../primitive-validations/category.validations';
import { BoatType, BoatUsage, ModelType, ResourceType } from '@bk/categories';
import { urlValidations } from '../fields/url.validations';
import { tagsValidations } from '../fields/tags.validations';

export const resourceFormValidations = staticSuite((model: ResourceFormModel, field?: string) => {
  if (field) only(field);

  stringValidations('bkey', model.bkey, SHORT_NAME_LENGTH);
  stringValidations('name', model.name, SHORT_NAME_LENGTH);
  stringValidations('boatName', model.boatName, SHORT_NAME_LENGTH);
  stringValidations('keyName', model.keyName, SHORT_NAME_LENGTH);
  numberValidations('lockerNr', model.lockerNr, true, 0, 200);
  numberValidations('keyNr', model.keyNr, true, 0, 200);
  categoryValidations('resourceType', model.resourceType, ResourceType);
  categoryValidations('boatType', model.boatType, BoatType);
  categoryValidations('boatUsage', model.boatUsage, BoatUsage);
  numberValidations('currentValue', model.currentValue, true, 0, 100000);
  numberValidations('weight', model.weight, true, 0, 10000);
  stringValidations('load', model.load, SHORT_NAME_LENGTH);
  stringValidations('hexColor', model.hexColor, SHORT_NAME_LENGTH);
  urlValidations('url', model.url);
  stringValidations('notes', model.notes, DESCRIPTION_LENGTH);
  tagsValidations('tags', model.tags);
  categoryValidations('modelType', model.modelType, ModelType);

  test('modelType', 'resourceModelType', () => {
    enforce(model.modelType).equals(ModelType.Boat || ModelType.Resource);
  });
});
