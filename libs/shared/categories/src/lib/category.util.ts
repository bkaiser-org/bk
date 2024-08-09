import { die, getProperty } from '@bk/util';
import { Category } from './category-model';
import { CategoryType } from './category-type';

/**
 * Return a Category based on its id.
 * BEWARE: categoryId can be explicit as defined in *-type.ts or a system category (-1 = Undefined, 99 = all)
 * @param categoryId the id of a category
 * @returns the category represented by the id
 */
export function readCategory(categories: Category[], categoryId: number): Category {
  if (categoryId === undefined) return newCategoryAll();
  switch (categoryId) {
    case CategoryType.All: return newCategoryAll();
    case CategoryType.Undefined: return newCategoryUndefined();
    default:
      return categories.find(i => i.id === categoryId) || newCategoryAll();
  }
}

/**
 * creates a new system category (All, Undefined)
 * @param categoryType the type of the system category to create
 * @returns the new system Category
 */
export function createSystemCategory(categoryType: CategoryType): Category {
  switch (categoryType) {
    case CategoryType.All: return newCategoryAll();
    case CategoryType.Undefined: return newCategoryUndefined();
    default:
      die(`category.util/createCategory(${categoryType}) -> invalid CategoryType`);
  }
}

export function newCategoryAll(): Category {
  return {
    id: CategoryType.All,
    abbreviation: 'ALL',
    name: 'all',
    i18nBase: 'general.category.all',
    icon: 'radio-button-on-outline'
  }
}

export function newCategoryUndefined(): Category {
  return {
    id: CategoryType.Undefined,
    abbreviation: 'UNDEF',
    name: 'undefined',
    i18nBase: 'general.category.undefined',
    icon: 'help-circle-outline'
  }
}

export function addCategory(categories: Category[], category: Category): Category[] {
  return [...categories, category];   // clones the array
}

export function addAllCategory(categories: Category[]): Category[] {
  return addCategory(categories, newCategoryAll());
}

export function addUndefinedCategory(categories: Category[]): Category[] {
  return addCategory(categories, newCategoryUndefined());
}

export function isSystemCategory(category: Category): boolean {
  return category.id < 0 || category.id >= CategoryType.All;
}

export function isUndefinedCategory(categoryId: number): boolean {
  return categoryId === -1;
}

export function containsCategory(categories: Category[], categoryId: number): boolean {
  return categories.find(i => i.id === categoryId) !== undefined;
}

export function countCategories(categories: Category[]): number {
  return categories.length;
}

export function getCategoryField(categories: Category[], categoryId: number, fieldName: string): string | number {
  return getProperty(readCategory(categories, categoryId), fieldName as keyof Category);
}

export function getCategoryStringField(categories: Category[], categoryId: number, fieldName: string): string {
  const _field = getCategoryField(categories, categoryId, fieldName);
  if (typeof _field !== 'string') die(`category.util/getStringField(): type of field ${fieldName} must be string.`);
  return _field;
}

export function getCategoryNumberField(categories: Category[], categoryId: number, fieldName: string): number {
  const _field = getCategoryField(categories, categoryId, fieldName);
  if (typeof _field !== 'number') die(`category.util/getNumberField(): type of field ${fieldName} must be number.`);
  return _field;
}

export function getCategoryFullName(categories: Category[], categoryId: number): string {
  return getCategoryAbbreviation(categories, categoryId) + ': ' + getCategoryName(categories, categoryId);
}

export function getCategoryName(categories: Category[], categoryId: number): string {
  return getCategoryStringField(categories, categoryId, 'name');
}

export function getCategoryPlaceholder(categories: Category[], categoryId: number): string {
  return `@${getCategoryStringField(categories, categoryId, 'i18nBase')}.placeholder`;
}

export function getCategoryAbbreviation(categories: Category[], categoryId: number) {
  return `${getCategoryStringField(categories, categoryId, 'abbreviation')}`;
}

export function getCategoryDescription(categories: Category[], categoryId: number) {
  return `@${getCategoryStringField(categories, categoryId, 'i18nBase')}.description`;
}

export function getCategoryLabel(categories: Category[], categoryId: number) {
  return `@${getCategoryStringField(categories, categoryId, 'i18nBase')}.label`;
}

export function getCategoryIcon(categories: Category[], categoryId: number): string {
  return getCategoryStringField(categories, categoryId, 'icon');
}

export function checkCategoryValue(categoryId: number, categories: Category[]): string | null {
  if (categoryId === CategoryType.Undefined) {
    return 'category is undefined';
  }
  if (containsCategory(categories, categoryId)) {
    return null;
  } else {
    return `category is invalid: ${categoryId}`;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function checkNumericEnum(categoryId: number, enumObj: any): string | null {
  if (categoryId in enumObj) return null;
  return `category is invalid: ${categoryId}`;
}

export function getCategoryImage(folderName: string, categoryName: string): string {
  return `assets/${folderName}/${categoryName}.png`;
}
