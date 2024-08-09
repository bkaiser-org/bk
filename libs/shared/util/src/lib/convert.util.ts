import { die, warn } from './log.util'; // log.util

/*-------------------------------------------- STRING ----------------------------------------------------- */
export function safeConvertString(fieldName: string, value: unknown, defaultValue: string): string {
    if (value === null || value === undefined) { // but not false or 0, that's why we can't test for !value
        return defaultValue;
    }
    if (typeof value === 'string') {
        return value.trim();
    }
    if (typeof value === 'number') {
        return value + '';
    }
    if (typeof value === 'boolean') {
        return value.toString();
    }
    warn(`util/safeConvertString(${fieldName}): unknown type <${JSON.stringify(value)}>`);
    return JSON.stringify(value);
}

/*-------------------------------------------- NUMBER ----------------------------------------------------- */
export interface DoubleNumber {
  number1: number,
  number2: number
}

// default: FirstLast
export enum NameDisplay {
  FirstLast,
  LastFirst,
  FirstOnly,
  LastOnly
}

export function name2numbers(name: string, delimiter = '/'): DoubleNumber {
  const _info = name.split(delimiter);
  if (_info.length !== 2) return { number1: 0, number2: 0 };
  return { number1: Number(_info[0].trim()), number2: Number(_info[1].trim()) };
}

export function doubleNumber2name(number1: number | undefined, number2: number | undefined, delimiter = '/'): string {
  return (number1 ? number1.toString() : '..') + delimiter + (number2 ? number2.toString() : '..');
}

export function safeConvertNumber(fieldName: string, value: unknown, defaultValue: number): number {
    if (value === null || value === undefined) { // but not false or 0, that's why we can't test for !value
        return defaultValue;
    }
    if (typeof value === 'number') {
        return value;
    }
    if (typeof value === 'string') {
        const _number = parseInt(value, 10);
        return isNaN(_number) ? defaultValue : _number;
    }
    if (typeof value === 'boolean') {
        return value === false ? 0 : 1;
    }
    warn(`util/safeConvertNumber(:${fieldName}): unknown type <${JSON.stringify(value)}>`);
    return defaultValue;
}

/*-------------------------------------------- BOOLEAN ----------------------------------------------------- */
export function safeConvertBoolean(fieldName: string, value: unknown, defaultValue: boolean): boolean {
    if (value === null || value === undefined) { // but not false or 0, that's why we can't test for !value
        return defaultValue;
    }
    if (typeof value === 'boolean') {
        return value;
    }
    if (typeof value === 'string') {
        return string2boolean(value);
    }
    if (typeof value === 'number') {
        return value !== 0;
    }
    warn(`util/safeConvertBoolean(:${fieldName}): unknown type <${JSON.stringify(value)}>`);
    return defaultValue;
}

export function string2boolean(val: string): boolean {
    if (!val) {
        return false;
    }
    switch (val.toLowerCase().trim()) {
        case 'true': case 'yes': case '1': return true;
        case 'false': case 'no': case '0': return false;
        default:
        // Any object of which the value is not undefined or null, 
        // including a Boolean object whose value is false, evaluates to true
            return Boolean(val);
    }
}

/*-------------------------------------------- ARRAY ----------------------------------------------------- */
/**
 * Converts a string containing a list of numbers into an array of numbers.
 * @param val a string containing a list of numbers
 * @param separator the separator between the numbers
 * @returns an array containing the numbers
 */
export function string2numberArray(val: string, separator = ','): number[] {
    return val.split(separator).map(function(_item) {
        return parseInt(_item, 10);
    });
}

export function removeElementFromStringArray(stringArray: string[], element: string): string[] {
    const _index = stringArray.indexOf(element);
    if (_index >= 0) {
        stringArray.splice(_index, 1);
    }
    return stringArray;
}

export function string2stringArray(val: string, separator = ','): string[] {
    const _stringArray = val.split(separator);
    // remove all empty strings
    const _result: string[] = [];
    for (const element of _stringArray) {
      const _str = element.trim();
      if (_str.length > 0) {
        _result.push(_str);
      }
    }
    return _result;
}

/**
 * Convert an array of strings into a json object.
 * @param words an array of strings
 * @returns a json object with a property { name: element } per array element
 */
export function stringArray2ObjectArray(words: string[]): NameObject[] {
    const _result: NameObject[] = [];
    for (const word of words) {
        _result.push({ name: word});
    }
    return _result;
}

/**
 * Takes an array of strings and returns a new array with only the unique elements, removing all duplicates.
 * This function is case insensitive.
 * It is an alternative to using Lodash uniq() function.
 * @param duplicates  the string array with duplicates
 * @returns  the string array with unique elements
 */
export function uniqueElements(duplicates: string[]): string[] {
  /* Pluck the values of the object mapping to an array */
  return Object.values(
    /* "Reduce" input array to an object mapping */
    duplicates.reduce((obj, str) =>     
    /* Insert str value into obj mapping with lower case key */
    ({ ...obj, [str.toLowerCase()] : str }), {})
  );
}

/*-------------------------------------------- NAME ----------------------------------------------------- */
export interface NameObject { name: string }

export function getFullPersonName(name1: string, name2: string, nickName = '', nameDisplay = NameDisplay.FirstLast, useNickName = false): string {
  if (useNickName === true && nickName && nickName.length > 0) {
    return nickName;
  }
  if (!name2 || name2.length === 0) return name1; // name2 is optional
  switch (nameDisplay) {
    case NameDisplay.FirstLast:
      return createFullName(name1, name2);
    case NameDisplay.LastFirst:
      return createFullName(name2, name1);
    case NameDisplay.FirstOnly:
      return name1;
    case NameDisplay.LastOnly:
      return name2;
    default: die('PersonUtil.getName -> invalid nameDisplay=' + nameDisplay);
  }
}

export function createFullName(name1: string, name2: string): string {
  let _name = '';
  if (name1 && name1.length > 0) {
    _name = name1 + ' ';
  }
  if (name2 && name2.length > 0) {
    _name = _name + name2;
  }
  return _name.trim();
}

/*-------------------------------------------- JSON ----------------------------------------------------- */
/**
 * Pretty print JSON code.
 * source: https://stackoverflow.com/questions/37308420/angular-2-pipe-that-transforms-json-object-to-pretty-printed-json
 */
export function jsonPrettyPrint(value: unknown): string {
    return JSON.stringify(value, null, 2)
        .replace(/ /g, '&nbsp;') // note the usage of `/ /g` instead of `' '` in order to replace all occurences
        .replace(/\n/g, '<br/>'); // same here
}

/*-------------------------------------------- HTML ----------------------------------------------------- */
/**
 * Replace all HTML or XML tags in <> brackets from the string.
 * @param value the string potentially containing html or xml tags
 * @returns same string without the html or xml tags
 */
export function stripHtml(value: string): string {
    return value.replace(/<.*?>/g, ''); // replace tags
}
