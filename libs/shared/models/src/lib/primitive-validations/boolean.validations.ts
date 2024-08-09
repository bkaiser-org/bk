import { test, enforce, omitWhen } from 'vest';

/**
 * Validates a boolean field
 * @param fieldName the name of the field that is validated (just for logging purposes)
 * @param value the value of the field
 * @param shouldBe an optional value to check against
 */
export function booleanValidations(fieldName: string, value: unknown, shouldBe?: boolean) {
  test(fieldName, 'notNull', () => {
    enforce(value).isNotNull();
  });
  test(fieldName, 'notUndefined', () => {
    enforce(value).isNotUndefined();
  });
  test(fieldName, 'booleanMandatory', () => {
    enforce(value).isBoolean();
  });
  omitWhen(shouldBe === undefined, () => {
    test(fieldName, `${fieldName} should be ${shouldBe}`, () => {
      enforce(value).equals(shouldBe);
    });
  });
}
