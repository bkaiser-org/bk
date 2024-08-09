import { Pipe, PipeTransform } from '@angular/core';
import { Category, getCategoryAbbreviation } from '@bk/categories';

@Pipe({
  name: 'categoryAbbreviation',
  standalone: true
})
export class CategoryAbbreviationPipe implements PipeTransform {
  transform(categoryId: number, categories: Category[]): string {
      return getCategoryAbbreviation(categories, categoryId);
  }
}