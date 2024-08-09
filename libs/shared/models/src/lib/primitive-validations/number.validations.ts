import { test, enforce, omitWhen } from 'vest';

/**
 * Validates a number field.
 * @param fieldName the name of the field that is validated (just for logging purposes)
 * @param value the value of the field
 * @param isInteger if true, the value must be an integer, default is true
 * @param min the value must not be smaller than this, default is 0
 * @param max the value must not be bigger than this, default is undefined
 */
export function numberValidations(fieldName: string, value: unknown, isInteger = true, min = 0, max?: number) {
  test(fieldName, 'notNull', () => {
    enforce(value).isNotNull();
  });
  test(fieldName, 'notUndefined', () => {
    enforce(value).isNotUndefined();
  });
  test(fieldName, 'numberMandatory', () => {
    enforce(value).isNumber();
  });
  omitWhen(isInteger === false, () => {
    test(fieldName, 'integerMandatory', () => {
      enforce(Number.isInteger(Number(value))).isTruthy();
    });
  });
  test(fieldName, 'minWrong', () => {
    enforce(value).greaterThanOrEquals(min);
  });
  omitWhen(max === undefined, () => {
    test(fieldName, 'maxWrong', () => {
      enforce(value).lessThanOrEquals(max);
    });
  });
}
