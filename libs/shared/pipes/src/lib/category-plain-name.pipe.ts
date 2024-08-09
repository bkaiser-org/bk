import { Pipe, PipeTransform } from '@angular/core';
import { Category, ColorIonic, getCategoryStringField } from '@bk/categories';

/**
 * Returns the translated i18n label for a category.
 */
@Pipe({
  name: 'categoryPlainName',
  standalone: true
})
export class CategoryPlainNamePipe implements PipeTransform {
  transform(categoryId: number | undefined, categories: Category[]): string {
    if (categoryId === ColorIonic.White) return '';
    return categoryId === undefined ? '' : getCategoryStringField(categories, categoryId, 'name');
  }
}