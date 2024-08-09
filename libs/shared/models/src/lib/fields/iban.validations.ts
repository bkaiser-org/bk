import { IBAN_LENGTH, checkIban } from '@bk/util';
import { test, enforce, omitWhen } from 'vest';
import { stringValidations } from '../primitive-validations/string.validations';

export function ibanValidations(fieldName: string, iban: unknown) {

  stringValidations(fieldName, iban, IBAN_LENGTH, IBAN_LENGTH);

  omitWhen(iban === '', () => {
    test(fieldName, 'validIban', () => {
      enforce(checkIban(iban as string)).isTruthy();
    });
  });
}
