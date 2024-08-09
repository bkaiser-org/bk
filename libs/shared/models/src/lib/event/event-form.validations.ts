/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { enforce, omitWhen, only, staticSuite, test} from 'vest';
import { stringValidations } from '../primitive-validations/string.validations';
import { isAfterDate, SHORT_NAME_LENGTH } from '@bk/util';
import { categoryValidations } from '../primitive-validations/category.validations';
import { EventType, Periodicity } from '@bk/categories';
import { dateValidations } from '../primitive-validations/date.validations';
import { EventFormModel } from './event-form.model';


export const eventFormValidations = staticSuite((model: EventFormModel, field?: string) => {
  if (field) only(field);

  stringValidations('bkey', model.bkey, SHORT_NAME_LENGTH);
  stringValidations('name', model.name, SHORT_NAME_LENGTH);
  categoryValidations('type', model.type, EventType);
  dateValidations('startDate', model.startDate);
  dateValidations('endDate', model.endDate);
  stringValidations('locationKey', model.locationKey, SHORT_NAME_LENGTH);
  categoryValidations('periodicity', model.periodicity, Periodicity);
  dateValidations('repeatUntilDate', model.repeatUntilDate);

  test('startDate', 'eventStartDateMandatory', () => {
    enforce(model.startDate).isNotEmpty();
  });
  // endDate is optional; if it is not set, it is set as the same as startDate

  // field cross validations
  omitWhen(!model.endDate || model.endDate === '', () => {
    test('endDate', 'eventEndDateAfterStartDate', () => {
      enforce(isAfterDate(model.endDate!, model.startDate!)).isTruthy();
    });
  });

  omitWhen(!model.repeatUntilDate || model.repeatUntilDate === '', () => {
    test('repeatUntilDate', 'eventRepeatUntilDateAfterStartDate', () => {
      enforce(isAfterDate(model.repeatUntilDate!, model.startDate!)).isTruthy();
    });
  });

  // test for periodicity = undefined or 0 (= Once)
  omitWhen(!model.periodicity, () => {
    test('repeatUntilDate', 'eventRepeatUntilDateMandatoryWithGivenPeriodicity', () => {
      enforce(model.repeatUntilDate).isNotEmpty();
    });
  })
});