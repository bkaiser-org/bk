import { test, enforce, omitWhen } from 'vest';
import { DateFormat, STORE_DATE_LENGTH, checkDate } from '@bk/util';
import { stringValidations } from './string.validations';

/**
 * Validate a date field. This must be in STOREDATE format: YYYYMMDD
 * @param fieldName the name of the field (just for logging purposes)
 * @param date the value of the field
 */
export function dateValidations(fieldName: string, date: unknown) {

  stringValidations(fieldName, date, STORE_DATE_LENGTH, STORE_DATE_LENGTH);

  omitWhen(date === '', () => {
    test(fieldName, 'validDate', () => {
      enforce(checkDate(fieldName, date as string, DateFormat.StoreDate, 1850, 2100, false)).isTruthy();
    });
  });
}

