import { Pipe, PipeTransform } from '@angular/core';
import { Category, getCategoryIcon } from '@bk/categories';

@Pipe({
  name: 'categoryIcon',
  standalone: true
})
export class CategoryIconPipe implements PipeTransform {
  transform(categoryId: number, categories: Category[]): string {
      return getCategoryIcon(categories, categoryId);
  }
}