
import { enforce, only, staticSuite, test} from 'vest';
import { LocationModel } from './location.model';
import { categoryValidations } from '../primitive-validations/category.validations';
import { stringValidations } from '../primitive-validations/string.validations';
import { SHORT_NAME_LENGTH } from '@bk/util';
import { numberValidations } from '../primitive-validations/number.validations';
import { LocationType, ModelType } from '@bk/categories';
import { baseValidations } from '../base/base.validations';

export const locationValidations = staticSuite((model: LocationModel, field?: string) => {
  if (field) only(field);

  baseValidations(model, field);
  categoryValidations('category', model.category, LocationType);
  numberValidations('latitude', model.latitude, false, -90, 90);
  numberValidations('longitude', model.longitude, false, -180, 180);
  stringValidations('placeId', model.placeId, SHORT_NAME_LENGTH);
  stringValidations('what3words', model.what3words, SHORT_NAME_LENGTH);
  numberValidations('height', model.height, false, 0, 9000);
  numberValidations('speed', model.speed, false, 0, 300);
  numberValidations('direction', model.direction, false, -180, 180);

  test('modelType', 'locationModelType', () => {
      enforce(model.modelType).numberEquals(ModelType.Location);
  });

});

// tbd: cross reference what3words and placeId, as well as latitude and longitude
// tbd: locationState: number
// tbd: visibleTo: string[]


