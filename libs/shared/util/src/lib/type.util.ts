import { die, warn } from './log.util';

export type BaseType = string | number | boolean;
export type BaseProperty = { key: string, value: BaseType };
export type PropertyList = Map<string, BaseType>;
// add a new property to the list:  params.set('key', 'value');
// get a property from the list: params.get('key');
// check whether a key exists:    params.has('key');
// remove a property from the list: params.delete('key');
// keys() returns an iterator for the keys
// values() returns an iterator for the values


/**
 * Returns the index of the first occurrence of a key in an BaseProperty array, or -1 if it is not present.
 * @param propertyList the BaseProperty array to search in
 * @param key the key to search for
 * @returns the index of the given key, or -1 if it is not present
 */
export function getIndexOfKey(propertyList: BaseProperty[], key: string): number {
  for (let i = 0; i < propertyList.length; i++) {
    if (propertyList[i].key === key) return i;
  }
  return -1;
}

/**
 * Returns the index of the first occurrence of a value in an BaseProperty array, or -1 if it is not present.
 * @param propertyList the BaseProperty array to search in
 * @param value the value to search for
 * @returns the index of the given value, or -1 if it is not present
 */
export function getIndexOfValue(propertyList: BaseProperty[], value: string): number {
  for (let i = 0; i < propertyList.length; i++) {
    if (propertyList[i].value === value) return i;
  }
  return -1;
}

export function getPropertyValue(propertyList: BaseProperty[] | undefined, key: string, defaultValue = ''): BaseType {
  if (!propertyList) {
    warn('TypeUtil.getPropertyValue: missing propertyList, returning defaultValue <' + defaultValue + '>.');
    return defaultValue;
  } else {
    const _index = getIndexOfKey(propertyList, key);
    if (_index === -1) {
      warn('TypeUtil.getPropertyValue: missing property, returning defaultValue <' + defaultValue + '>.');
      return defaultValue;  
    } else {
      return propertyList[_index].value;
    }
  }
}

/**
 * type-safe lookup of an object property.
 * use like this:
 * let x = { foo: 10, bar: "hello" };
 * let foo = getProperty(x, 'foo'); / number
 * let oops = getProperty(x, 'blabla'); // Error! 'blabla' is not 'foo' | 'bar'
 * 
 * @param obj the object
 * @param key the name of the property to look up
 */
export function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]; // Inferred type is T[K]
}

export function getProperties<T extends object>(obj: T): string[] {
  return Object.keys(obj)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hasProperty(obj: any, key: string): boolean {
  return key in obj;
}

/**
 * Type-safe setting of an object property.
 * use like this:
 * setProperty(x, 'foo', 'string'); // Error!, string expected number
 * @param obj the object
 * @param key the name of the property to set
 * @param value the value of the property to set
 */
export function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]) {
  obj[key] = value;
}

export function compareName(name1: string, name2: string): boolean {
  return name1 && name2 ? name1.toLowerCase().indexOf(name2.toLowerCase()) > -1 : false;
}

/**
 * This method can be used in filters.
 * It returns true if the searchTerm is either empty or matches the nameProperty.
 * @param nameProperty 
 * @param searchTerm 
 */
export function nameMatches(nameProperty: string, searchTerm: string | null | undefined): boolean {
  if (!searchTerm || searchTerm.length === 0) return true;
  return compareName(nameProperty, searchTerm);
}

export function numberMatches(numberProperty: number, searchTerm: string | number | null | undefined): boolean {
  if (searchTerm === undefined || searchTerm === null) return true;
  const _searchNumber = parseInt(searchTerm + '');
  return compareNumbers(numberProperty, _searchNumber) === 0;
}

/**
 * Generic type guard for simple objects (does not work with Arrays).
 * usage: if (isType(data, BaseModel))
 * @param unknownVar the data to check the type for
 * @param expectedType the type the object is expected to have
 */
export function isType<T>(unknownVar: unknown, expectedType: T): unknownVar is T {
  if (!unknownVar) return false;
  return typeof unknownVar === typeof expectedType;
}

// the following type guards are from: https://github.com/hqoss
// changed from const to functions
export function isUndefined<T>(term: T | undefined): term is undefined {
  return typeof term === 'undefined';
}

export function isBoolean<U>(term: boolean | U): term is boolean {
  return typeof term === 'boolean';
}

export function isNumber<U>(term: number | U): term is number {
  return typeof term === 'number';
}

export function isString<U>(term: string | U): term is string {
  return typeof term === 'string';
}

export function isBaseType<U>(term: BaseType | U): term is BaseType {
  return isString(term) || isNumber(term) || isBoolean(term);
}

export function isArrayOfStrings(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === "string");
}

export function isArrayOfBaseProperties(value: unknown): value is BaseProperty[] {
  return Array.isArray(value) && value.every(item => isBaseType(item));
}

export function isNonEmptyArrayOfStrings(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0 && value.every(item => typeof item === "string");
}

export function isNonEmptyArray<T, U>(term: Array<T> | U): term is Array<T> {
  return isArray(term) && term.length > 0;
}

export function isNonEmptyString<U>(term: string | U): term is string {
  return isString(term) && term.length > 0;
}

export function isValidNumber<U>(term: number | U): term is number {
  return isNumber(term) && !Number.isNaN(term);
}

export function isInteger<U>(term: number | U): term is number {
  return isValidNumber(term) && Number.isInteger(term);
}

export function isPositiveInteger<U>(term: number | U): term is number {
  return isInteger(term) && term > 0;
}

export function isNonNegativeInteger<U>(term: number | U): term is number {
  return isInteger(term) && term >= 0;
}

export function isNegativeInteger<U>(term: number | U): term is number {
  return isInteger(term) && term < 0;
}

export function isNull<T>(term: T | null): term is null {
  return term === null;
}

// narrow HTMLElement to HTMLINputElement
// source: https://stackoverflow.com/questions/48488701/type-null-is-not-assignable-to-type-htmlinputelement-reactjs
export function isInputElement(elem: HTMLElement | null): elem is HTMLInputElement {
  return !elem ? false : elem?.tagName === 'INPUT';
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction<T extends Function, U>(term: T | U): term is T {
  return typeof term === 'function';
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isObject<T extends object, U>(
  term: T | U,
): term is NonNullable<T> {
  return !isNull(term) && typeof term === 'object';
}

export function isArray<T, U>(term: Array<T> | U): term is Array<T> {
  return Array.isArray(term);
}

export function isDate<U>(term: Date | U): term is Date {
  return term instanceof Date;
}

// custom checkers
export function isObjectWithId<T>(obj: T): obj is T {
  return isObject(obj) && hasProperty(obj, 'id');
}

export function isObjectWithKeyAndName<T>(obj: T): obj is T {
  return isObject(obj) && hasProperty(obj, 'bkey') && hasProperty(obj, 'name');
}

export function validateNumberRange(value: unknown, min: number, max: number): boolean {
  if (!value) die('validateNumberRange: invalid value');
  if (typeof value !== 'number') die('validateNumberRange: value must be a number');
  return value >= min && value <= max;
}

// optional type
// use like this: let user: Optional<User>;
export type Optional<T> = T | undefined;

export enum SortOrder {
  Smaller = -1,
  Equal = 0,
  Bigger = 1
}

export function compareNumbers(a: number, b: number): number {
  return a - b;
}

export function compareWords(a: string, b: string): number {
  const nameA = a.toUpperCase(); 
  const nameB = b.toUpperCase();
  if (nameA < nameB) return -1;
  if (nameA > nameB) return 1;
  return 0;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function compareObjects(data: any[], fieldName: string, isAscending = true) {
  return data.sort((a, b) => {
      return a[fieldName].toString().localeCompare(b[fieldName]) * (isAscending ? 1 : -1)
  });
}

/**
 * Moves an element of an array from its current position (fromIndex) to a different position (toIndex).
 * splice performs operations on the array in-place, so the data contains the new ordering.
 * @param data the array to work on
 * @param fromIndex the position of the element to move
 * @param toIndex  the new position the element should be moved to
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function arrayMove(data: any[], fromIndex: number, toIndex: number): void {
  if (toIndex >= data.length) {
      let k = toIndex - data.length + 1;
      while (k--) {
          data.push(undefined);
      }
  }
  data.splice(toIndex, 0, data.splice(fromIndex, 1)[0]);
}

export function mapMove(propertyList: Map<string, BaseType>, fromIndex: number, toIndex: number): Map<string, BaseType> {
  const _keys = Array.from(propertyList.keys());
  arrayMove(_keys, fromIndex, toIndex); // an array with the newly ordered keys
  const _propertyList = new Map<string, BaseType>();
  for (let i = 0; i < _keys.length; i++) {
    const _value = propertyList.get(_keys[i]);
    if (_value !== undefined) _propertyList.set(_keys[i], _value);
  }
  propertyList.clear();
  return _propertyList;
}

export function checkForString(field: string | null | undefined): string {
  //  return (field === null || field === undefined) ? '' : field;
  return field ?? '';
}

export function checkForNumber(field: number | null | undefined): number {
  // return (field === null || field === undefined) ? 0 : field;
  return field ?? 0;
} 

export function getNextChar(char: string): string | null {
  if (char.length !== 1) return null; // ensure the input is a single character
  const _charCode = char.charCodeAt(0);
  return String.fromCharCode(_charCode + 1);
}

/**
 * Returns the next string of a given string of arbitraty length.
 * This can be used to query for incomplete strings in a Firestore database.
 * e.g. where('name', '>=', 'abc' and where('name', '<', getNextString('abc'))
 * @param str the given string
 * @returns the next string, e.g. 'abc' -> 'abd'
 * 
 * TBD: check and handle Umlaute !
 */
export function getNextString(str: string): string | null {
  const _lastIndex = str.length - 1;
  const _lastChar = str.charAt(_lastIndex); // get the last character
  const _nextChar = getNextChar(_lastChar);
  if (!_nextChar) return null;
  if (_nextChar > 'z') { // if the next character is 'z', wrap arount to 'a'
    return str.substring(0, _lastIndex) + 'a';
  } else {    // otherwise, replace the last character with the next character
    return str.substring(0, _lastIndex) + _nextChar;
  }
}

/**
  * Replaces the first occurrence of a substring in a string with a new substring.
  * @param sourceString the string to search in
  * @param patternStr the substring to search for
  * @param replacementStr the substring to replace the pattern with
  * @returns the modified string; the sourceString is not changed.
  * example: replaceSubstring('abcabc', 'a', 'x') -> 'xbcabc'
  * example: replaceSubstring('Rainstr. 10', 'str.', 'strasse') -> 'Rainstrasse 10'
  */
export function replaceSubstring(sourceString: string, patternStr: string, replacementStr: string): string {
  return sourceString.replace(patternStr, replacementStr);
}

export function replaceEndingSlash(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}