import { stringValidations } from '../primitive-validations/string.validations';
import { SHORT_NAME_LENGTH } from '@bk/util';

export function colorValidations(fieldName: string, color: unknown) {

  stringValidations(fieldName, color, SHORT_NAME_LENGTH);

  // tbd: test for valid color (hex, rgb, rgba, hsl, hsla)
}

