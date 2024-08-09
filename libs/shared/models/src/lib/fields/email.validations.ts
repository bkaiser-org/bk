import { stringValidations } from '../primitive-validations/string.validations';
import { LONG_NAME_LENGTH } from '@bk/util';
import { test, enforce, omitWhen } from 'vest';
import 'vest/enforce/email';

export function emailValidations(fieldName: string, email: unknown) {

  stringValidations(fieldName, email, LONG_NAME_LENGTH);

  omitWhen(email === '', () => {
    test(fieldName, 'validEmailFormat', () => {
      enforce(email).isEmail();
    });
  });
}
