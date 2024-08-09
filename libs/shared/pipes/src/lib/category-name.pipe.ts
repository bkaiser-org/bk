import { Pipe, PipeTransform } from '@angular/core';
import { Category, getCategoryLabel } from '@bk/categories';
import { bkTranslate } from '@bk/util';

/**
 * Returns the translated i18n label for a category.
 */
@Pipe({
  name: 'categoryName',
  standalone: true
})
export class CategoryNamePipe implements PipeTransform {
  transform(categoryId: number | undefined, categories: Category[]): string {
    if (categoryId === undefined)  return '';
    return bkTranslate(getCategoryLabel(categories, categoryId));
  }
}