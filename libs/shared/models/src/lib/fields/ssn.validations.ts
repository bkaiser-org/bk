import { SSN_LENGTH, checkAhv } from '@bk/util';
import { test, enforce, omitWhen } from 'vest';
import { stringValidations } from '../primitive-validations/string.validations';

export function ssnValidations(fieldName: string, ssn: unknown ) {

  stringValidations(fieldName, ssn, SSN_LENGTH, SSN_LENGTH);

  omitWhen(ssn === '', () => {
    test(fieldName, 'validSSN', () => {
      enforce(checkAhv(ssn as string)).isTruthy();
    });
  });
}

