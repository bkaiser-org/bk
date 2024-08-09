import { computeAhvn13checkDigit, die, warn } from '@bk/util';
import { RegexCategory, RegexType, REGEXES, REGEX_TYPES } from './regex-type';

export function getRegex(regexType: RegexType): RegExp {
    return new RegExp(REGEXES[regexType]);
}

export function getRegexString(regexType: RegexType): string {
    return REGEXES[regexType];
}

export function getRegexCategory(regexType: RegexType): RegexCategory {
    return REGEX_TYPES[regexType];
}

/**
 * Validates the swiss social security number (AVHN13 / EAN13).
 * see: https://gist.github.com/rordi/e6445c0927da635750f93532a0c6c320
 * see: http://regexlib.com
 * @param control the ahv number to validate
 */
export function checkAhv13(value: unknown, isStrict = true): boolean {
    if (!value) die('validateAhv13: invalid value.');
    if (typeof value !== 'string') die('validateAhv13: value must be of type string.');

    // empty string is ok as default value in optional field
    if (value.length === 0) {
      if (isStrict === true) {
        die('regex.util/checkAhv13: mandatory ahv number is missing');
      } else {
        return true;
      }
    }
    if (getRegex(RegexType.AHVN13).test(value)) {
        const _checkDigit = computeAhvn13checkDigit(value);
        if (_checkDigit === Number(value.slice(-1))) {
            return true;
        } else {
            warn('ahv.util/checkAhv13: check-digit not correct');
            return false;
        }
    }
    warn('ahv.util/checkAhv13: regex check failed');
    return false;
}

export function checkWithRegex(value: unknown, regexType: RegexType, isStrict = true): boolean {
    if (!value) die('validators/checkWithRegex: invalid value');
    if (typeof value !== 'string') die('validators/checkWithRegex: value must be of type string');
    if (value.length === 0) {
      if (isStrict === true) {
        warn('validators/checkWithRegex mandatory value is empty');
        return false;
      } else {
        return true;
      }
    }
    if (getRegex(regexType).test(value)) {
      return true;
    }
    warn('validators/checkWithRegex: regex check failed');
    return false;
  }
  