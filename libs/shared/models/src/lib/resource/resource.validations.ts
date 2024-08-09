import { enforce, omitWhen, only, staticSuite, test} from 'vest';
import { ResourceModel } from './resource.model';
import { baseValidations } from '../base/base.validations';
import { stringValidations } from '../primitive-validations/string.validations';
import { categoryValidations } from '../primitive-validations/category.validations';
import { BoatType, BoatUsage, ModelType, ResourceType } from '@bk/categories';
import { numberValidations } from '../primitive-validations/number.validations';
import { SHORT_NAME_LENGTH } from '@bk/util';
import 'vest/enforce/compounds';

export const resourceValidations = staticSuite((model: ResourceModel, field?: string) => {
  if (field) only(field);

  baseValidations(model, field);

  test('modelType', 'resourceModelType', () => {
    enforce(model.modelType).oneOf(
      enforce.numberEquals(ModelType.Boat),
      enforce.numberEquals(ModelType.Resource)
    );
  });

  categoryValidations('resourceType', model.category, ResourceType);

  numberValidations('currentValue', model.currentValue, true, 0, 100000);


  stringValidations('load', model.load, SHORT_NAME_LENGTH);
  numberValidations('weight', model.weight, true, 0, 10000);
  stringValidations('color', model.color, SHORT_NAME_LENGTH); // hexcolor

  // cross field validations
  omitWhen(model.modelType !== ModelType.Boat, () => {
    test('boatType', 'boatSubType', () => {
      enforce(model.subType).inside(Object.values(BoatType));
    });

    categoryValidations('usage', model.usage, BoatUsage);
  });
  omitWhen(model.modelType !== ModelType.Resource, () => {
    test('subType', 'resourceSubTypeUndefined', () => {
      enforce(model.subType).equals(-1);
    });
    test('usage', 'resourceUsageUndefined', () => {
      enforce(model.usage).equals(-1);
    });
  });

  // cross collection validations

});
