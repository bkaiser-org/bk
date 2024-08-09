import { Pipe, PipeTransform } from '@angular/core';
import { Category, getCategoryPlaceholder } from '@bk/categories';
import { bkTranslate } from '@bk/util';

@Pipe({
  name: 'categoryPlaceholder',
  standalone: true
})
export class CategoryPlaceholderPipe implements PipeTransform {
  transform(categoryId: number | undefined, categories: Category[]): string {
    if (!categoryId)  return '';
    return bkTranslate(getCategoryPlaceholder(categories, categoryId));
  }
}
