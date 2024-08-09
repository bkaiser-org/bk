import { omitWhen, only, staticSuite} from 'vest';
import { stringValidations } from '../primitive-validations/string.validations';
import { DESCRIPTION_LENGTH, SHORT_NAME_LENGTH } from '@bk/util';
import { ModelType } from '@bk/categories';
import { numberValidations } from '../primitive-validations/number.validations';
import { dateTimeValidations } from '../primitive-validations/dateTime.validations';
import { urlValidations } from '../fields/url.validations';
import { tagsValidations } from '../fields/tags.validations';
import { TripFormModel } from './trip-form.model';

export const tripFormValidations = staticSuite((model: TripFormModel, field?: string) => {
  if (field) only(field);

  stringValidations('bkey', model.bkey, SHORT_NAME_LENGTH);
  stringValidations('name', model.name, SHORT_NAME_LENGTH);
  urlValidations('url', model.url);
  stringValidations('notes', model.notes, DESCRIPTION_LENGTH);
  tagsValidations('tags', model.tags);

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