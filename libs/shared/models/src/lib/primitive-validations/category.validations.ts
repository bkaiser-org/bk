import { test, enforce } from 'vest';

/**
 * Validates a category field.
 * @param fieldName the name of the field that is validated (just for logging purposes)
 * @param category the category value
 * @param categoryEnum the value needs to be a value of this enum
 */
export function categoryValidations(fieldName: string, category: unknown, categoryEnum: object ) 

  {
  test(fieldName, 'notNull', () => {
    enforce(category).isNotNull();
  });
  test(fieldName, 'notUndefined', () => {
    enforce(category).isNotUndefined();
  });
  test(fieldName, 'numberMandatory', () => {
    enforce(category).isNumber();
  });
  test(fieldName, 'enumValue', () => {
    enforce(category).inside(Object.values(categoryEnum));
  });
}
