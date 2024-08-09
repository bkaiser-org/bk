
import { only, staticSuite} from 'vest';
import { categoryValidations } from '../primitive-validations/category.validations';
import { stringValidations } from '../primitive-validations/string.validations';
import { SHORT_NAME_LENGTH } from '@bk/util';
import { numberValidations } from '../primitive-validations/number.validations';
import { LocationType } from '@bk/categories';
import { LocationFormModel } from './location-form.model';

export const locationFormValidations = staticSuite((model: LocationFormModel, field?: string) => {
  if (field) only(field);

  stringValidations('bkey', model.bkey, SHORT_NAME_LENGTH);
  stringValidations('name', model.name, SHORT_NAME_LENGTH);
  categoryValidations('locationType', model.locationType, LocationType);
  numberValidations('latitude', model.latitude, false, -90, 90);
  numberValidations('longitude', model.longitude, false, -180, 180);
  stringValidations('placeId', model.placeId, SHORT_NAME_LENGTH);
  stringValidations('what3words', model.what3words, SHORT_NAME_LENGTH);
  numberValidations('height', model.height, false, 0, 9000);
  numberValidations('speed', model.speed, false, 0, 300);
  numberValidations('direction', model.direction, false, -180, 180);
  numberValidations('modelType', model.modelType, false, 11, 11);
});

// tbd: cross reference what3words and placeId, as well as latitude and longitude
// tbd: locationState: number
// tbd: visibleTo: string[]


