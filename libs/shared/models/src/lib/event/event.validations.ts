import { enforce, omitWhen, only, staticSuite, test} from 'vest';
import { categoryValidations } from '../primitive-validations/category.validations';
import { EventModel } from './event.model';
import { stringValidations } from '../primitive-validations/string.validations';
import { SHORT_NAME_LENGTH, isAfterDate } from '@bk/util';
import { EventType, ModelType, Periodicity } from '@bk/categories';
import { dateValidations } from '../primitive-validations/date.validations';
import { baseValidations } from '../base/base.validations';

export const eventValidations = staticSuite((model: EventModel, field?: string) => {
  if (field) only(field);

  baseValidations(model, field);
  categoryValidations('category', model.category, EventType);
  dateValidations('startDate', model.startDate);
  dateValidations('endDate', model.endDate);
  stringValidations('locationKey', model.locationKey, SHORT_NAME_LENGTH);
  categoryValidations('periodicity', model.periodicity, Periodicity);
  dateValidations('repeatUntilDate', model.repeatUntilDate);

  test('modelType', 'eventModelType', () => {
    enforce(model.modelType).equals(ModelType.Event);
  });

  test('startDate', 'eventStartDateMandatory', () => {
    enforce(model.startDate).isNotEmpty();
  });
  test('endDate', 'eventEndDateMandatory', () => {
    enforce(model.endDate).isNotEmpty();
  });

  // field cross validations
  test('endDate', 'eventEndDateAfterStartDate', () => {
    enforce(isAfterDate(model.endDate, model.startDate)).isTruthy();
  });

  omitWhen(model.repeatUntilDate === '', () => {
    test('repeatUntilDate', 'eventRepeatUntilDateAfterStartDate', () => {
      enforce(isAfterDate(model.repeatUntilDate, model.startDate)).isTruthy();
    });
  });

  omitWhen(model.periodicity === Periodicity.Once, () => {
    test('repeatUntilDate', 'eventRepeatUntilDateMandatoryWithGivenPeriodicity', () => {
      enforce(model.repeatUntilDate).isNotEmpty();
    });
  })

});

// tbd: cross the locationKey to reference into locations

