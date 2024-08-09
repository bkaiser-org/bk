import { test, enforce, omitWhen } from 'vest';
import { DateFormat, STORE_DATETIME_LENGTH, checkDate } from '@bk/util';
import { stringValidations } from './string.validations';

/**
 * Validate a date/time field. This must be in STOREDATE format: YYYYMMDDHHMMSS
 * @param fieldName the name of the field (just for logging purposes)
 * @param date the value of the field
 */
export function dateTimeValidations(fieldName: string, date: unknown) {

  stringValidations(fieldName, date, STORE_DATETIME_LENGTH, STORE_DATETIME_LENGTH);

  omitWhen(date === '', () => {
    test(fieldName, 'validDateTime', () => {
      enforce(checkDate(fieldName, date as string, DateFormat.StoreDateTime, 1850, 2100, false)).isTruthy();
    });
  });
}

