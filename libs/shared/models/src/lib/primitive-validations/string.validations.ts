import { test, enforce, omitWhen } from 'vest';

/**
 * Validates a string field
 * @param fieldName the name of the field that is validated (just for logging purposes)
 * @param value the value of the field
 * @param maxLength the value must not be longer than this, typically this is set to a constant in constants.ts
 * @param minLength the value must not be shorter than this, default is 0
 * @param isMandatory true if the field must not be empty, default is false
 */
export function stringValidations(fieldName: string, value: unknown, maxLength?: number, minLength = 0, isMandatory = false): void {
  test(fieldName, `${fieldName} may not be null`, () => {
    enforce(value).isNotNull();
  });
  test(fieldName, `${fieldName} may not be undefined`, () => {
    enforce(value).isNotUndefined();
  });
  test(fieldName, `${fieldName} must be of type string`, () => {
    enforce(value).isString();
  });
  omitWhen(isMandatory === false, () => {
    test(fieldName, `${fieldName} is mandatory`, () => {
      enforce(value as string).isNotBlank();
    });
  });
  omitWhen(maxLength === undefined || isMandatory === false, () => {
    test(fieldName, `${fieldName} may not be longer than ${maxLength} characters`, () => {
      enforce(value as string).shorterThanOrEquals(maxLength);
    });
  });
  omitWhen(minLength === undefined || isMandatory === false, () => {
    test(fieldName, `${fieldName} must have min. ${minLength} characters`, () => {
      enforce(value as string).longerThanOrEquals(minLength);
    });
  });
}
