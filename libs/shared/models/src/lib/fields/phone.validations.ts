import { SHORT_NAME_LENGTH } from '@bk/util';
import { stringValidations } from '../primitive-validations/string.validations';

export function phoneValidations(fieldName: string, phoneNumber: unknown ) {

  stringValidations(fieldName, phoneNumber, SHORT_NAME_LENGTH, 10);

  // tdb: validate phone number format based on country
}

