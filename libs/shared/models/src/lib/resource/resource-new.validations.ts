import { enforce, only, staticSuite, test} from 'vest';
import { ResourceNewFormModel } from './resource-new.model';
import { stringValidations } from '../primitive-validations/string.validations';
import { DESCRIPTION_LENGTH, SHORT_NAME_LENGTH } from '@bk/util';
import { numberValidations } from '../primitive-validations/number.validations';
import { categoryValidations } from '../primitive-validations/category.validations';
import { tagsValidations } from '../fields/tags.validations';
import { BoatType, BoatUsage, ModelType, ResourceType } from '@bk/categories';

export const resourceNewValidations = staticSuite((model: ResourceNewFormModel, field?: string) => {
  if (field) only(field);

  stringValidations('name', model.name, SHORT_NAME_LENGTH);
  numberValidations('lockerNr', model.lockerNr, true, 0, 200);
  numberValidations('keyNr', model.keyNr, true, 0, 200);
  categoryValidations('resourceType', model.category, ResourceType);
  categoryValidations('boatType', model.boatType, BoatType);
  categoryValidations('boatUsage', model.boatUsage, BoatUsage);
  numberValidations('currentValue', model.currentValue, true, 0, 100000);
  numberValidations('weight', model.weight, true, 0, 10000);
  stringValidations('load', model.load, SHORT_NAME_LENGTH);
  stringValidations('hexColor', model.hexColor, SHORT_NAME_LENGTH);
  stringValidations('notes', model.notes, DESCRIPTION_LENGTH);
  tagsValidations('tags', model.tags);
  categoryValidations('modelType', model.modelType, ModelType);

  test('modelType', 'resourceModelType', () => {
    enforce(model.modelType).equals(ModelType.Boat || ModelType.Resource);
  });
});
