import { stringValidations } from '../primitive-validations/string.validations';
import { LONG_NAME_LENGTH } from '@bk/util';

export function tagsValidations(fieldName: string, tags: unknown) {

  stringValidations(fieldName, tags, LONG_NAME_LENGTH);

  // tbd - test for valid tags
}
