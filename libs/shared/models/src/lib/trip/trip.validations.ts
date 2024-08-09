import { omitWhen, only, staticSuite} from 'vest';
import { stringValidations } from '../primitive-validations/string.validations';
import { SHORT_NAME_LENGTH } from '@bk/util';
import { ModelType } from '@bk/categories';
import { numberValidations } from '../primitive-validations/number.validations';
import { baseValidations } from '../base/base.validations';
import { TripModel } from './trip.model';
import { dateTimeValidations } from '../primitive-validations/dateTime.validations';

export const tripValidations = staticSuite((model: TripModel, field?: string) => {
  if (field) only(field);

  baseValidations(model, field);
  stringValidations('resourceKey', model.resourceKey, SHORT_NAME_LENGTH);
  numberValidations('modelType', model.modelType, true, ModelType.Trip, ModelType.Trip);
//  categoryValidations('category', model.category, TripType);

  omitWhen(model.startDateTime === '', () => {
    dateTimeValidations('startDateTime', model.startDateTime);
  });
  omitWhen(model.endDateTime === '', () => {
    dateTimeValidations('endDateTime', model.endDateTime);
  });


  // tbd: locations: string[]
  // tbd: persons: string[]

  // cross collection validations
});
